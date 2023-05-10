import MAPBOX_TOKEN from "@/utils/MAPBOX_TOKEN";
import Map, { Layer, Source } from 'react-map-gl';
import ControlPanel from "@/components/sentiment/ControlPanel";
import { sentimentChoroplethMapLayerStyle } from "@/components/AI/layers";
import { getSentimentData } from "@/utils/api/api";
import { StatusCodes } from "http-status-codes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updatePercentiles } from "./utils";

export default function SentimentMap() {
  const [time, setTime] = useState(8);
  const [allData, setAllData] = useState<any>(null);
  const [hoverInfo, setHoverInfo] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getSentimentData()
      if (response.status === StatusCodes.OK) {
        setAllData(response.data)
      }
    };
    fetchData();
  },[])

  const onHover = useCallback((event:any) => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];

    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  const data = useMemo(() => {
    return allData && updatePercentiles(allData, f => f.properties?.sentiment[time]);
  }, [allData, time]);

  return (
    <>
      <Map
        initialViewState={{
          longitude: 133.7751,
          latitude: -25.2744,
          zoom: 3,
        }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onMouseMove={onHover}
        style={{width: '100%', height: '80vh'}}
      >
        <Source type="geojson" data={data}>
          <Layer {...sentimentChoroplethMapLayerStyle} />
        </Source>
        <ControlPanel time={time} onChange={(value:any) => setTime(value)} />
        {hoverInfo && (
          <div className="tooltip"
            style={{
              left: hoverInfo.x,
              top: hoverInfo.y,
              position: 'absolute',
              margin: '8px',
              padding: '4px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              maxWidth: '300px',
              fontSize: '10px',
              zIndex: '999',
              pointerEvents: 'none',
            }}>
            <div>Suburb: {hoverInfo.feature.properties.state_name}</div>
            <div>Sentiment Value: {(hoverInfo.feature.properties.value)}</div>
            <div>Percentile: {hoverInfo.feature.properties.percentile}</div>
          </div>
        )}
      </Map>
    </>
  );
}
