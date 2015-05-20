"use strict";

import EyesActions from "../actions/EyesActions";
import EyeStore from "../stores/EyeStore";
import React from "react";
import {Map, OverlayView} from "react-googlemaps";
import _ from "lodash";
import google from "../utils/google";
import Media from "./Media";

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

const EyeMap = React.createClass({

  componentDidMount () {
    EyeStore.addChangeListener(_.throttle(this.onChangeStore, 200));
    EyesActions.requestEyes();
  },

  lookAt :  _.debounce(EyesActions.lookAt, 1000),

  getInitialState () {
    return {medias : []};
  },

  componentWillUnmount () {
    EyesActions.unrequestEyes();
  },

  render () {
    return (
      <div className={"mapwrapper"}>
        <a href="http://www.machard.io" target="_blank" style={copyrightStyle}>
          By http://www.machard.io
        </a>
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

  onChangeStore() {
    this.setState({
      medias : EyeStore.getMedias()
    });
  }

});

export default EyeMap;
