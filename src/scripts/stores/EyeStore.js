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

    if (action.type !== EyesConstants.ActionTypes.NEW_MESSAGE) {
      return;
    }

    // duplicate can not be filtered until there is some kind of 
    // bufferization
    // that's why duplicate come from twitter to here
    var has = _.some(this.state.medias, function(media) {
      return media.data.id === action.message.data.id;
    });

    if (has) {
      return;
    }

    this.state.medias.push(action.message);

    this.emitChange();

    setTimeout(() => {
      _.remove(this.state.medias, action.message);
      this.emitChange();
    }, 2000);
  }
});

export default Store;
