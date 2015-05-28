"use strict";

import React from "react";
import _ from "lodash";

var style = {
  transition : "opacity 0.6s ease"
};

// needed because we can not use ReactCSSTransitionGroup with gmap's OverlayView
// because they are not handled by react.

const FadingImage = React.createClass({

  getInitialState () {
    return {
      loaded : false,
      faded : false
    };
  },

  render () {
    return (
      <img onLoad={this.onLoad} src={this.props.src} style={_.merge(style, this.props.style, {opacity: (this.state.loaded && !this.state.faded) ? 100 : 0})} />
    );
  },

  onLoad () {
    this.setState({loaded : true});

    setTimeout(() => {
      this.setState({faded : true});

      this.props.onUnload();
    }, this.props.fading);
  }

});

export default FadingImage;
