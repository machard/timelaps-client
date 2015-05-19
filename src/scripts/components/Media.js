"use strict";

import React from "react";
import Image from "./Image";

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
        media = <Image 
          style={imgStyle(this.props.size)}
          src={this.props.media.data.media_url} 
        />;
        break;
      case "instagram.com":
        media = <Image
          style={imgStyle(this.props.size)}
          src={this.props.media.data.url + "media/?size=m"} 
        />;
        break;
      default :
        media = null;
    }

    return media;
  }

});

export default Media;
