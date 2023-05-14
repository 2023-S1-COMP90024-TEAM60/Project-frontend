// export default Page
import Head from "next/head";
import Map, { GeoJSONSource,MapRef } from 'react-map-gl';
import { useEffect, useMemo, useRef, useState } from "react";
import ControlPanel from "@/components/AI/ControlPanel";
import HeatMapLayer from "@/components/AI/HeatMapLayer";
import { clusterLayerStyle } from "@/components/AI/layers";
import ClusterLayer from "@/components/AI/ClusterLayer";
import { getAIData } from "@/utils/api/api";
import { StatusCodes } from "http-status-codes";
import MAPBOX_TOKEN from "@/utils/MAPBOX_TOKEN";
import { Skeleton } from "antd";

export default function AIMap() {
  const [checkedLayer, setCheckedLayer] = useState<string[]>(['cluster']);
  const [allDays, useAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, selectTime] = useState(0);
  const [aiData, setAIData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getAIData()
      if (response.status === StatusCodes.OK) {
        setLoading(false);
        const features = response.data.features;
        const sortedFeatures = features.map((feature:any) => ({
          ...feature,
          properties:{
            ...feature.properties,
            timestamp: new Date(feature.properties.timestamp).valueOf()
          }
        })).sort((a:any, b:any) => a.properties.timestamp - b.properties.timestamp)
        const data = {...response.data, features: sortedFeatures}
        const startTime = sortedFeatures[0].properties.timestamp;
        const endTime = sortedFeatures[sortedFeatures.length - 1].properties.timestamp;
        setTimeRange([startTime, endTime]);
        selectTime(endTime);
        setAIData(data);
      }
    };
    fetchData();
  },[])

  const mapRef = useRef<MapRef>(null);

  const onClick = (event:any) => {
    if(event.features[0]) {
      const feature = event.features[0];
      const clusterId = feature.properties.cluster_id;

      const mapboxSource = mapRef.current?.getSource('earthquakes') as GeoJSONSource;

      mapboxSource.getClusterExpansionZoom(clusterId, (err:any, zoom:any) => {
        if (err) {
          return;
        }

        mapRef.current?.easeTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500
        });
      });
    }
    console.log(event)
  };
  
  function filterFeaturesByDay(featureCollection: any, time: any) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const features = featureCollection.features.filter((feature:any) => {
      const featureDate = new Date(feature.properties.timestamp);
      return (
        featureDate.getFullYear() === year &&
        featureDate.getMonth() === month &&
        featureDate.getDate() === day
      );
    });
    console.log({type: 'FeatureCollection', features})
    return {type: 'FeatureCollection', features};
  }

  const data = useMemo(() => {
    return allDays ? aiData : filterFeaturesByDay(aiData, selectedTime);
  }, [aiData, allDays, selectedTime]);

  return (
    <>
      <Head>
        <title>AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h3 style={{ marginBottom: '16px', textAlign: 'center'}}>The map for the number of AI related tweets data in Australia</h3>
      {loading ? <Skeleton active /> : <Map
        initialViewState={{
          longitude: 133.7751,
          latitude: -25.2744,
          zoom: 3,
        }}
        style={{width: '100%', height: '80vh'}}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken = { MAPBOX_TOKEN }
        interactiveLayerIds={[clusterLayerStyle.id!]}
        onClick={onClick}
        ref={mapRef}
      >
        <ControlPanel setCheckedLayer={ setCheckedLayer } 
          startTime={timeRange[0]}
          endTime={timeRange[1]}
          selectedTime={selectedTime}
          allDays={allDays}
          onChangeTime={selectTime}
          onChangeAllDays={useAllDays}
          checkedLayer={checkedLayer}
        />
        { checkedLayer.includes('heatmap') && data && <HeatMapLayer heatMapData={data} />}
        { checkedLayer.includes('cluster') && data && <ClusterLayer heatMapData={data} />}
      </Map>}
    </>
  );
}
