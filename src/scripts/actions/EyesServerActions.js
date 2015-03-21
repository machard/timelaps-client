'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import EyesConstants from '../constants/EyesConstants';

export default {
  newMessage : (message) => {
    AppDispatcher.dispatch({
      type : EyesConstants.ActionTypes.NEW_MESSAGE,
      message : message
    });
  }
};
