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

    EyesActions.lookAt({
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
