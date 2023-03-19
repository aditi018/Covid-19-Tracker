import React from 'react'
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import {showDataOnMap} from "./utils";

function Map({countries,casesType,center,zoom}) {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contibutors'
        />
        {showDataOnMap(countries,casesType)}
      </LeafletMap>
    </div>
  )
}

export default Map
