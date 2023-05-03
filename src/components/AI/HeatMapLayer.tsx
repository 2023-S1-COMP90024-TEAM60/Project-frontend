import React from 'react';
import { 
  Layer,
  Source,
} from 'react-map-gl';
import { heatmapLayerStyle } from './layers';

const HeatMapLayer = ({ heatMapData }: any) => {
  return(
    <>
      <Source id="heatmap" type="geojson" data={ heatMapData }>
        <Layer { ...heatmapLayerStyle } />
      </Source>
    </>

  )
}

export default HeatMapLayer;
