"use strict";

import React from "react";


const Media = React.createClass({

  render () {
    let media;

    switch(this.props.media.type) {
      case "photo" :
        media = <img 
          width={this.props.width}
          height={this.props.height}
          src={this.props.media.data.media_url} 
        />;
        break;
      case "instagram.com":
        media = <img
          width={this.props.width}
          height={this.props.height}
          src={this.props.media.data.url + "media/?size=m"} 
        />;
        break;
      default :
        console.log(this.props.media);
        media = <span>unhandled</span>;
    }

    return media;
  }

});

export default Media;
