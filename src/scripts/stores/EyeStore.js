"use strict";

import AppDispatcher from "../dispatcher/AppDispatcher";
import EyesConstants from "../constants/EyesConstants";
import FluxStore from "flux-store";
import _ from "lodash";

const Store = FluxStore.extend({
  dispatcher : AppDispatcher,
  state : {
    medias : []
  },
  getMedias : function() {
    return this.state.medias;
  },
  onDispatcherAction : function(action) {

    switch (action.type) {
      case EyesConstants.ActionTypes.NEW_MESSAGE:
        // duplicate can not be filtered until there is some kind of 
        // bufferization
        // that's why duplicate come from twitter to here
        var has = _.some(this.state.medias, function(media) {
          return media.data.id === action.message.data.id;
        });

        // the length condition is for slow connection where image load too slowly,
        // we start to drop some of them at some point
        if (has || this.state.medias.length > 150) {
          return;
        }

        this.state.medias.push(action.message);

        break;
      case EyesConstants.ActionTypes.REMOVE_MEDIA:
        _.remove(this.state.medias, action.media);
        break;
      default:
        return;
    }

    this.emitChange();
  }
});

export default Store;
