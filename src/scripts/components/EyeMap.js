"use strict";

import EyesActions from "../actions/EyesActions";
import EyeStore from "../stores/EyeStore";
import React from "react";
import {Map, OverlayView} from "react-googlemaps";
import _ from "lodash";
import google from "../utils/google";
import Media from "./Media";
import config from "../constants/config";

var copyrightStyle = {
  position: "absolute",
  bottom: 20,
  right: 20,
  backgroundColor: "#75d9c6",
  color: "white",
  padding: 10,
  boxShadow: "1px 1px 8px 0px #656565",
  zIndex: 1,
  textDecoration: "none"
};

var shareStyle = {
  position: "absolute",
  bottom: 20,
  left: 20,
  backgroundColor: "#75d9c6",
  padding: 10,
  boxShadow: "1px 1px 8px 0px #656565",
  zIndex: 1
};

var fbStyle = {
  position: "relative",
  top: -4,
  marginRight: 10
};

var twStyle = {
  position: "relative",
  top: 2
};

var suspendedStyle = {
  position: "absolute",
  zIndex : 1,
  height: "auto",
  width : 300,
  left : "50%",
  top : "50%",
  marginTop : -50,
  marginLeft : -150,
  textAlign : "center",
  backgroundColor : "#75d9c6",
  padding: 20,
  color : "white"
};

const EyeMap = React.createClass({

  componentDidMount () {
    this.onSeen = _.throttle(this.onSeenHandler, 200);

    EyeStore.addChangeListener(this.onSeen);
    EyesActions.requestEyes();
  },

  lookAt :  _.debounce(EyesActions.lookAt, 1000),

  getInitialState () {
    return {medias : []};
  },

  componentWillUnmount () {
    EyeStore.removeChangeListener(this.onSeen);
    EyesActions.unrequestEyes();
  },

  render () {
    return (
      <div className={"mapwrapper"}>
        {
          config.suspended ? 
            <div style={suspendedStyle}>
              Backend is currently suspended because it costs money !
            </div>
          :
            null
        }
        <a href="http://www.machard.io" target="_blank" style={copyrightStyle}>
          By http://www.machard.io
        </a>
        <span style={shareStyle}>
          <div style={twStyle}>
            <div style={fbStyle} className="fb-like" data-href="https://timelaps.divshot.io" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true"></div>
          
            <a href="https://twitter.com/share" className="twitter-share-button" data-url="http://timelaps.divshot.io" data-text="Timelaps : see the the world in realtime through people eyes">Tweet</a>
          </div>
        </span>
        <Map
          initialZoom={3}
          initialCenter={new google.maps.LatLng(40, 0)}
          initialDisableDefaultUI
          width={"100%"}
          height={"100%"}
          minZoom={2}
          onCenterChange={this.onBoundsChange}
          onBoundsChange={this.onBoundsChange}
        >
          {this.state.medias.map(function(media) {
            return <OverlayView
              key={media.data.id}
              mapPane="floatPane"
              position={new google.maps.LatLng(media.position.lat, media.position.lng)}>
              <Media media={media} size={60} />
            </OverlayView>;
          })}
        </Map>
      </div>
    );
  },

  onBoundsChange(map) {
    let bounds = map.getBounds();

    if ((
      bounds.getNorthEast().lat() > 85 ||
      bounds.getSouthWest().lat() < -73
    )) {
      map.panTo(this.lastValidCenter);
      map.setZoom(this.lastValidZoom);
      return;
    }
    
    this.lastValidCenter = map.getCenter();
    this.lastValidZoom = map.getZoom();

    this.lookAt({
      minlat : bounds.getSouthWest().lat(),
      minlng : bounds.getSouthWest().lng(),
      maxlat : bounds.getNorthEast().lat(),
      maxlng : bounds.getNorthEast().lng()
    });

  },

  onSeenHandler() {
    this.setState({
      medias : EyeStore.getMedias()
    }); 
  }

});

export default EyeMap;
