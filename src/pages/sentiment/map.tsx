import MAPBOX_TOKEN from "@/utils/MAPBOX_TOKEN";
import Map, { Layer, Source } from 'react-map-gl';
import ControlPanel from "@/components/sentiment/ControlPanel";
import { sentimentChoroplethMapLayerStyle } from "@/components/AI/layers";
import { getSentimentData } from "@/utils/api/api";
import { StatusCodes } from "http-status-codes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updatePercentiles } from "./utils";

export default function SentimentMap() {
  const [year, setYear] = useState(2015);
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
    return allData && updatePercentiles(allData, f => f.properties?.income[year]);
  }, [allData, year]);

  return (
    <>
      <Map
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={['data']}
        onMouseMove={onHover}
        style={{width: '100%', height: '80vh'}}
      >
        <Source type="geojson" data={data}>
          <Layer {...sentimentChoroplethMapLayerStyle} />
        </Source>
        <ControlPanel year={year} onChange={(value:any) => setYear(value)} />
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
            <div>State: {hoverInfo.feature.properties.name}</div>
            <div>Median Household Income: {hoverInfo.feature.properties.value}</div>
            <div>Percentile: {(hoverInfo.feature.properties.percentile / 8) * 100}</div>
          </div>
        )}
      </Map>
    </>
  );
}
