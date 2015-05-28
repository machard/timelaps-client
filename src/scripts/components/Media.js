"use strict";

import React from "react";
import FadingImage from "./FadingImage";
import EyesActions from "../actions/EyesActions";

function imgStyle(size) {
  return {
    width: size,
    height: size,
    borderRadius: size/2,
    boxShadow: "0 0 8px rgba(0, 0, 0, .8)"
  };
}


const Media = React.createClass({

  render () {
    let media;

    switch(this.props.media.type) {
      case "photo" :
        media = <FadingImage onUnload={this.onUnload} fading={3000}
          style={imgStyle(this.props.size)}
          src={this.props.media.data.media_url} 
        />;
        break;
      case "instagram.com":
        media = <FadingImage onUnload={this.onUnload} fading={3000}
          style={imgStyle(this.props.size)}
          src={this.props.media.data.url + "media/?size=m"} 
        />;
        break;
      // case "video":
      // case ...
      default :
        media = null;
    }

    return media;
  },

  onUnload () {
    EyesActions.removeMedia(this.props.media);
  }

});

export default Media;
