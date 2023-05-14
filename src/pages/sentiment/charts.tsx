import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { StatusCodes } from "http-status-codes";
import { Row, Col, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter, BarChart, Bar, Cell, Text } from 'recharts';
import { colorCode, stackedChartColorCode } from '@/constants/charts';

import { getAllLgaInfo, getAustraliaSentimentTimeline, getSentimentData, getTopSentimentLgaPerState } from "@/utils/api/api";
import { generateColorCodesArray } from '@/utils/functions/charts';
import styles from "@/pages/sentiment/charts.module.scss";

function getAustraliaSentimentTimelineChartData(australiaSentimentTimelineData: any) {
  const data: any = [];
  for (let i = 0; i < australiaSentimentTimelineData.length; i++) {
    const item = australiaSentimentTimelineData[i];
    const data_point = {
      name: item["time"],
      value: item["value"]
    };
    data.push(data_point);
  }
  return data;
}

function getLgaSentimentScatterData(lgaSentimentData: any) {
  const data_by_lga: any = [];
  if (Object.keys(lgaSentimentData).length == 0) {
    return data_by_lga;
  }
  for (let i = 0; i < lgaSentimentData["features"].length; i++) {
    const data: any = []
    const item = lgaSentimentData["features"][i]["sentiment"];
    for (let k in item) {
      const data_point = {
        time: parseInt(k),
        value: item[k]
      };
      data.push(data_point);
    }
    data_by_lga.push(data);
  }
  return data_by_lga;
}

function normalizeSentimentData(lgaSentimentData: any) {
  let max = Number.MIN_VALUE;
  let min = Number.MAX_VALUE;
  for (let i = 0; i < lgaSentimentData["features"].length; i++) {
    const item = lgaSentimentData["features"][i]["sentiment"];
    for (let k in item) {
      if (item[k] < min) {
        min = item[k];
      }
      if (item[k] > max) {
        max = item[k]
      }
    }
  }

  for (let i = 0; i < lgaSentimentData["features"].length; i++) {
    const item = lgaSentimentData["features"][i]["sentiment"];
    for (let k in item) {
      item[k] = (item[k] - min) / (max - min);
    }
  }
  return lgaSentimentData
}

function getTopSentimentLgaPerStateChartData(topSentimentLgaPerStateData: any, lgaInfo: any) {
  const data: any = [];
  if (Object.keys(lgaInfo).length == 0) {
    return data;
  }
  if (topSentimentLgaPerStateData.length) {
    for (let i = 0; i < topSentimentLgaPerStateData.length; i++) {
      const item = topSentimentLgaPerStateData[i];
      const data_point: any = {
        "sentiment": item["sentiment"],
        "suburb": lgaInfo["suburbs"][parseInt(item["lga_code"])]["name"],
        "state": lgaInfo["states"][parseInt(item["state_code"])]["name"],
        "name": `${lgaInfo["states"][parseInt(item["state_code"])]["name"]} - ${lgaInfo["suburbs"][parseInt(item["lga_code"])]["name"]}`
      }
      data.push(data_point)
    }
  }
  return data;
}

export default function SentimentCharts() {
  const [lgaInfo, setLgaInfo]: any = useState({});
  const [australiaSentimentTimeline, setAustraliaSentimentTimeline] = useState([]);
  const [lgaSentimentData, setLgaSentimentData]: any = useState({});
  const [topSentimentLgaPerState, setTopSentimentLgaPerState]: any = useState({});
  useEffect(() => {
    const fetchLgaInfoData = async () => {
      const response = await getAllLgaInfo();
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        setLgaInfo(data);
      }
    };

    const fetchAustraliaSentimentTimeline = async () => {
      const response = await getAustraliaSentimentTimeline();
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        setAustraliaSentimentTimeline(data);
      }
    }

    const fetchLgaSentimentData = async () => {
      const response = await getSentimentData(false);
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        setLgaSentimentData(normalizeSentimentData(data));
      }
    }

    const fetchTopSentimentLgaPerState = async () => {
      const response = await getTopSentimentLgaPerState();
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        setTopSentimentLgaPerState(data);
      }
    }

    fetchLgaInfoData();
    fetchAustraliaSentimentTimeline();
    fetchLgaSentimentData();
    fetchTopSentimentLgaPerState();
  }, []);

  const australiaSentimentTimelineChartData = useMemo(() => {
    return getAustraliaSentimentTimelineChartData(australiaSentimentTimeline);
  }, [australiaSentimentTimeline]);



  const renderAustraliaSentimentTimeline = useMemo(() => {
    if (australiaSentimentTimeline.length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={australiaSentimentTimelineChartData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}`} />
            <Legend name="Average sentiment level" />
            <Line type="monotone" dataKey="value" stroke={colorCode[0]} activeDot={{ r: 8 }} name="Average sentiment level" />
          </LineChart>
        </ResponsiveContainer>

      )
    }
  }, [australiaSentimentTimeline])

  const lgaSentimentScatterData = useMemo(() => {
    return getLgaSentimentScatterData(lgaSentimentData);
  }, [lgaSentimentData]);

  const renderlgaSentimentScatter = useMemo(() => {
    const scatterColorCode = generateColorCodesArray(5000);
    if (lgaSentimentScatterData.length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="time" />
            <YAxis type="number" dataKey="value" range={[-1, 0.25]} allowDataOverflow={false} />
            {lgaSentimentScatterData.map((lga_data: any, index: number) => (
              <Scatter data={lga_data} fill={scatterColorCode[index % scatterColorCode.length]} isAnimationActive={false}>
              </Scatter>
            ))
            }

          </ScatterChart>
        </ResponsiveContainer>

      )
    }
  }, [lgaSentimentScatterData])

  const topSentimentLgaPerStateChartData = useMemo(() => {
    return getTopSentimentLgaPerStateChartData(topSentimentLgaPerState, lgaInfo);
  }, [lgaInfo, topSentimentLgaPerState]);

  const getPath = (x: number, y: number, width: number, height: number) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };

  const TriangleBar = (props: any) => {
    const { fill, x, y, width, height } = props;
  
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  const CustomizedAxisTick = (props: any) => {
    const {x, y, payload} = props;
  
    return <Text x={x} y={y} width={75} textAnchor="middle" verticalAnchor="start">{payload.value}</Text>
  };

  const renderTopSentimentLgaPerStateChart = useMemo(() => {
    if (topSentimentLgaPerStateChartData.length > 0) {
      console.log("renderTopSentimentLgaPerStateChart")
      console.log(topSentimentLgaPerStateChartData)
      return (
        <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topSentimentLgaPerStateChartData}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}`} />
          <XAxis dataKey="name" interval={0} tick={<CustomizedAxisTick />} height={100}/>
          <YAxis />
          <Bar dataKey="sentiment" fill="#8884d8" shape={<TriangleBar />}>
            {topSentimentLgaPerStateChartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={stackedChartColorCode[index % 20]} />
            ))}
          </Bar>
        </BarChart>
        </ResponsiveContainer>
      )
    }
  }, [topSentimentLgaPerStateChartData])
  

  return (
    <>
      <Head>
        <title>AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Row gutter={[16, 16]} style={{ minHeight: "50vh" }}>
        <Col span={24}>
          {topSentimentLgaPerStateChartData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Happiest suburb in each state`}</h3>
              {renderTopSentimentLgaPerStateChart}
            </div>
          }
          {topSentimentLgaPerStateChartData.length == 0 &&
            <Skeleton active />
          }
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ minHeight: "50vh" }}>
        <Col span={24}>
          {australiaSentimentTimelineChartData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Australian Sentiment Changes in a day`}</h3>
              {renderAustraliaSentimentTimeline}
            </div>
          }
          {australiaSentimentTimelineChartData.length == 0 &&
            <Skeleton active />
          }
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ minHeight: "50vh" }}>
        <Col span={24}>
          {lgaSentimentScatterData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Normalized sentiment level of all the suburbs in a day`}</h3>
              {renderlgaSentimentScatter}
            </div>
          }
          {lgaSentimentScatterData.length == 0 &&
            <Skeleton active />
          }
        </Col>
      </Row>
      

    </>
  );
}
