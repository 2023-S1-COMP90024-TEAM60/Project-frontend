import type {LayerProps} from 'react-map-gl';
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
    'heatmap-weight': {
      property: 'count',
      type: 'exponential',
      stops: [
        [0, 0],
        [260, 2]
      ]
    },

    'heatmap-intensity': {
      stops: [
        [11, 1],
        [14, 3]
      ]
    },
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0,
      'rgba(229, 115, 115,0)',
      0.2,
      'rgb(229, 115, 115)',
      0.4,
      'rgb(229, 115, 115)',
      0.6,
      'rgb(229, 115, 115)',
      0.8,
      'rgb(229, 115, 115)'
    ],
    'heatmap-opacity': {
      default: 1,
      stops: [
        [13, 1],
        [14, 0]
      ]
    },
    'heatmap-radius': {
      stops: [
        [11, 15],
        [14, 20]
      ]
    },
  }
};
