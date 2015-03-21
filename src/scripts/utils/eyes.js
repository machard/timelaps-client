import webstomp from "./webstomp";
import config from "../constants/config";
import quadtree from "quadtree";
import EyesServerActions from "../actions/EyesServerActions";

class Eyes {
  constructor() {
    this.subscriptions = [];
    this.using = 0;
    this.started = false;
  }

  start() {
    this.using++;
    this.started = true;
    webstomp.start();
  }

  stop() {
    if (!this.started) {
      return;
    }

    this.using--;

    if (!this.using) {
      webstomp.stop();
    }
  }

  _onEyeMessage(message) {
    EyesServerActions.newMessage(message);
  }

  // currently it can not handle looking to multiple bbox
  // if called repeatidly it will stop looking the old bbox
  // then start to look again
  // {minlat, minlng, maxlat, maxlng}
  lookAt(bbox) {
    let precision, zones, containing;

    for (precision = 1; precision <= config.quadtreePrecision; precision++) {
      zones = quadtree.envelop(bbox, precision);

      zones.forEach((zone) => {
        let cbbox = quadtree.bbox(zone);

        if (
          cbbox.minlat > bbox.minlat &&
          cbbox.minlng > bbox.minlng &&
          cbbox.maxlng < bbox.maxlng &&
          cbbox.maxlat < bbox.maxlat
        ) {
          containing = true;
        }
      });

      if (containing) {
        break;
      }
    }

    while (this.subscriptions.length) {
      webstomp.unsubscribe(this.subscriptions.pop());
    }

    zones.forEach((zone) => {
      let topic = zone.substring(0, precision).split("").join(".");
      let subscription = "/exchange/media/" + topic + ".#";
      webstomp.subscribe(subscription, this._onEyeMessage.bind(this));
      this.subscriptions.push(subscription);
    });
  }
}

export default new Eyes();