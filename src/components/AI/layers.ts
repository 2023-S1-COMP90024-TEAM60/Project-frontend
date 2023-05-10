import type {FillLayer, LayerProps} from 'react-map-gl';
const MAX_ZOOM_LEVEL = 14;

export const clusterLayerStyle: LayerProps = {
  id: 'clusters',
  type: 'circle',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
  }
};

export const clusterCountLayerStyle: LayerProps = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'earthquakes',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
  }
};

export const unclusteredPointLayerStyle: LayerProps = {
  id: 'unclustered-point',
  type: 'circle',
  source: 'earthquakes',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
  }
};

export const heatmapLayerStyle: LayerProps = {
  id: 'heatmap',
  type: 'heatmap' as "heatmap",
  maxzoom: MAX_ZOOM_LEVEL,
  paint: {
    // Increase the heatmap weight based on frequency and property magnitude
    'heatmap-weight': ['interpolate', ['linear'], ['get', 'mag'], 0, 0, 6, 1],
    // Increase the heatmap color weight weight by zoom level
    // heatmap-intensity is a multiplier on top of heatmap-weight
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, MAX_ZOOM_LEVEL, 3],
    // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
    // Begin color ramp at 0-stop with a 0-transparancy color
    // to create a blur-like effect.
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(33,102,172,0)',
      0.2,
      'rgb(103,169,207)',
      0.4,
      'rgb(209,229,240)',
      0.6,
      'rgb(253,219,199)',
      0.8,
      'rgb(239,138,98)',
      0.9,
      'rgb(255,201,101)'
    ],
    // Adjust the heatmap radius by zoom level
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, MAX_ZOOM_LEVEL, 20],
    // Transition from heatmap to circle layer by zoom level
    'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0]
  }
};

export const sentimentChoroplethMapLayerStyle: FillLayer = {
  id: 'data',
  type: 'fill',
  paint: {
    'fill-color': {
      property: 'percentile',
      // stops: [
      //   [0, '#3288bd'],
      //   [1, '#66c2a5'],
      //   [2, '#abdda4'],
      //   [3, '#e6f598'],
      //   [4, '#ffffbf'],
      //   [5, '#fee08b'],
      //   [6, '#fdae61'],
      //   [7, '#f46d43'],
      //   [8, '#d53e4f']
      // ]
      // stops: [
      //   [0, '#0d47a1'],
      //   [1, '#1565c0'],
      //   [2, '#1976d2'],
      //   [3, '#1e88e5'],
      //   [4, '#2196f3'],
      //   [5, '#42a5f5'],
      //   [6, '#64b5f6'],
      //   [7, '#90caf9'],
      //   [8, '#bbdefb'],
      //   [9, '#ffffff'],
      //   [10, '#ffebee'],
      //   [11, '#ffcdd2'],
      //   [12, '#ef9a9a'],
      //   [13, '#e57373'],
      //   [14, '#ef5350'],
      //   [15, '#f44336'],
      //   [16, '#e53935'],
      //   [17, '#d32f2f'],
      //   [18, '#b71c1c'],
      // ]
      stops: [
        [0, '#1976d2'],
        [1, '#2196f3'],
        [2, '#64b5f6'],
        [3, '#90caf9'],
        [4, 'rgb(52,51,50)'],
        [5, '#ffcdd2'],
        [6, '#e57373'],
        [7, '#ef5350'],
        [8, '#e53935'],
      ]
      // stops: [
      //   [0, '#2196f3'],
      //   [1, '#90caf9'],
      //   [2, '#757575'],
      //   [3, '#ffcdd2'],
      //   [4, '#ef5350'],
      // ]
      // stops: [
      //   [0, '#ffebee'],
      //   [1, '#ffcdd2'],
      //   [2, '#ef9a9a'],
      //   [3, '#e57373'],
      //   [4, '#ef5350'],
      //   [5, '#f44336'],
      //   [6, '#e53935'],
      //   [7, '#d32f2f'],
      //   [8, '#c62828'],
      //   [9, '#b71c1c'],
      // ]
    },
    'fill-opacity': 0.8
  }
};
