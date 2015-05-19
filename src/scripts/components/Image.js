"use strict";

import React from "react";
import _ from "lodash";

var style = {
  transition : "opacity 0.6s ease"
};

const Image = React.createClass({

  getInitialState () {
    return {loaded : false};
  },

  render () {
    return (
      <img onLoad={this.onLoad} src={this.props.src} style={_.merge(style, this.props.style, {opacity: this.state.loaded ? 100 : 0})} />
    );
  },

  onLoad () {
    this.setState({loaded : true});
  }

});

export default Image;
