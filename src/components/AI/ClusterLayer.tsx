import React from 'react';
import { 
  Layer,
  Source,
} from 'react-map-gl';
import { clusterCountLayerStyle, clusterLayerStyle, unclusteredPointLayerStyle } from './layers';
import demoJson from "../../../public/example";

const ClusterLayer = ({ heatMapData }: any) => {
  return(
    <Source
      id="earthquakes"
      type="geojson"
      // data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
      data={heatMapData}
      // data={demoJson}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      <Layer {...clusterLayerStyle} />
      <Layer {...clusterCountLayerStyle} />
      <Layer {...unclusteredPointLayerStyle} />
    </Source>
  )
}

export default ClusterLayer;
