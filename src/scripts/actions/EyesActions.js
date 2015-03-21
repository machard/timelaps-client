'use strict';

import eyes from '../utils/eyes';

export default {
  requestEyes : () => {
    eyes.start();
  },
  unrequestEyes : () => {
    eyes.stop();
  },
  lookAt : (bbox) => {
    eyes.lookAt(bbox);
  }
};
