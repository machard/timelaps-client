import config from "../constants/config";
import {Stomp} from "../../../node_modules/stompjs/lib/stomp";
import SockJS from "sockjs-client";

class Webstomp {
  constructor() {
    super();

    this.client = null;
    this.buffer = [];
    this.subscriptions = {};
    this.started = false;
    this.connected = false;

    this.using = 0;
  }

  _connect() {
    if (!this.client) {
      this.client = Stomp.over(new SockJS(config.rabbitUrl));
      this.client.heartbeat.incoming = 0;
      this.client.heartbeat.outgoing = 0;
      this.client.debug = () => {};
    }

    this.client.connect(
      config.rabbitUser,
      config.rabbitPass,
      this.onConnect.bind(this),
      this.onError.bind(this)
    );
  }

  start() {
    this.using++;

    if (this.started) {
      return;
    }

    this.started = true;

    this._connect();
  }

  stop() {
    if (!this.started) {
      return;
    }

    this.using--;

    if (!this.using) {
      this.started = false;
      this.connected = false;
      this.client.disconnect();
    }
  }

  onError() {
    if (!this.client.connected) {
      this.connected = false;

      if (this.started) {
        setTimeout(this._connect.bind(this), 200);
      }
    }
  }

  onConnect() {
    this.connected = true;

    for (let to in this.subscriptions) {
      this.subscribe(to);
    }

    this.buffer.forEach(function(action) {
      action();
    });
  }

  subscribe(to, listener) {
    if (!this.connected) {
      this.buffer.push(() => {
        this.subscribe(to, listener);
      });
      return;
    }

    this.subscriptions[to] = this.client.subscribe(to, (message) => {
      listener(JSON.parse(message.body));
    });

    return to;
  }

  unsubscribe(to) {
    if (!this.connected) {
      this.buffer.push(() => {
        this.unsubscribe(to);
      });
    }

    if (!this.subscriptions[to]) {
      return;
    }

    this.subscriptions[to].unsubscribe();

    delete this.subscriptions[to];
  }
}

export default new Webstomp();