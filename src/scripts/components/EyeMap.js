"use strict";

import EyesActions from "../actions/EyesActions";
import EyeStore from "../stores/EyeStore";
import React from "react";
import {Map, OverlayView} from "react-googlemaps";
import _ from "lodash";
import google from "../utils/google";
import Media from "./Media";


const EyeMap = React.createClass({

  componentDidMount () {
    EyeStore.addChangeListener(_.throttle(this.onChangeStore, 200));
    EyesActions.requestEyes();

    this.lookAt = _.debounce(EyesActions.lookAt, 500);
  },

  getInitialState () {
    return {medias : []};
  },

  componentWillUnmount () {
    EyesActions.unrequestEyes();
  },

  render () {
    return (
      <div className={"mapwrapper"}>
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
              <Media media={media} width={40} height={40} />
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
