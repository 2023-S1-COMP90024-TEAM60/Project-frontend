// export default Page
import Head from "next/head";
import Map, { GeoJSONSource,MapRef } from 'react-map-gl';
import MAPBOX_TOKEN from '../utils/MAPBOX_TOKEN';
import { useEffect, useMemo, useRef, useState } from "react";
import ControlPanel from "@/components/AI/ControlPanel";
import HeatMapLayer from "@/components/AI/HeatMapLayer";
import { clusterLayerStyle } from "@/components/AI/layers";
import ClusterLayer from "@/components/AI/ClusterLayer";

export default function AI() {
  const [checkedLayer, setCheckedLayer] = useState<string[]>([]);
  const [allDays, useAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, selectTime] = useState(0);
  const [earthquakes, setEarthQuakes] = useState(null);
  useEffect(() => {
    /* global fetch */
    fetch('https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson')
      .then(resp => resp.json())
      .then(json => {
        // Note: In a real application you would do a validation of JSON data before doing anything with it,
        // but for demonstration purposes we ingore this part here and just trying to select needed data...
        const features = json.features;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;

        setTimeRange([startTime, endTime]);
        setEarthQuakes(json);
        selectTime(endTime);
      })
      .catch(err => console.error('Could not load data', err)); // eslint-disable-line
  }, []);

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
      const featureDate = new Date(feature.properties.time);
      return (
        featureDate.getFullYear() === year &&
        featureDate.getMonth() === month &&
        featureDate.getDate() === day
      );
    });
    return {type: 'FeatureCollection', features};
  }

  const data = useMemo(() => {
    return allDays ? earthquakes : filterFeaturesByDay(earthquakes, selectedTime);
  }, [earthquakes, allDays, selectedTime]);

  return (
    <>
      <Head>
        <title>AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
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
          onChangeAllDays={useAllDays}/>
        { checkedLayer.includes('heatmap') && data && <HeatMapLayer heatMapData={data}/>}
        { checkedLayer.includes('cluster') && data && <ClusterLayer heatMapData={data}/>}
      </Map>
    </>
  );
}
