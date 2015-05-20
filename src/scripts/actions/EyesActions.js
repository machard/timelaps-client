"use strict";

import eyes from "../utils/eyes";

import AppDispatcher from "../dispatcher/AppDispatcher";
import EyesConstants from "../constants/EyesConstants";

export default {
  requestEyes : () => {
    eyes.start();
  },
  unrequestEyes : () => {
    eyes.stop();
  },
  lookAt : (bbox) => {
    eyes.lookAt(bbox);
  },
  removeMedia : (media) => {
    AppDispatcher.dispatch({
      type : EyesConstants.ActionTypes.REMOVE_MEDIA,
      media : media
    });
  }
};
