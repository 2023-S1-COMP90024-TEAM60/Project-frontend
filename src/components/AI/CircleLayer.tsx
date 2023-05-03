import { CirclePaint } from 'mapbox-gl';
import React from 'react';
import { Layer, Source } from 'react-map-gl';
const CircleLayer = ({ heatMapData }: any) => {
  const MIN_ZOOM_LEVEL = 13;
  const layerStyle = {
    id: 'poi-point',
    type: 'circle' as "circle",
    minzoom: MIN_ZOOM_LEVEL,
    paint: {
      'circle-radius': {
        property: 'count',
        type: 'exponential',
        stops: [
          [{ zoom: 14, value: 1 }, 15],
          [{ zoom: 14, value: 260 }, 22],
          [{ zoom: 22, value: 1 }, 20],
          [{ zoom: 22, value: 260 }, 50]
        ]
      },
      'circle-color': {
        property: 'count',
        type: 'interval',
        stops: [
          [0, '#ffebee'],
          [20, '#ffcdd2'],
          [40, '#ef9a9a'],
          [60, '#e57373'],
          [80, '#ef5350'],
          [100, '#f44336'],
          [140, '#e53935'],
          [180, '#d32f2f'],
          [220, '#c62828'],
          [260, '#b71c1c'],

        ]
      },
      'circle-stroke-color': 'white',
      'circle-stroke-width': 1,
      'circle-opacity': {
        stops: [
          [13, 0],
          [14, 1]
        ]
      }
    } as CirclePaint
  }

  return(
    <>
      <Source id="poi-point" type="geojson" data={ heatMapData }>
        <Layer { ...layerStyle } />
      </Source>
    </>

  )
}

export default CircleLayer;
