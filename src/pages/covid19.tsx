import { colorCode } from "@/constants/charts";
import { getCovidKeywordsCount, getCovidTimelineCount } from "@/utils/api/api";
import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import { FunctionComponent, useEffect, useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, LabelList, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Covid19() {
  const [covidTimelineCount, setCovidTimeLineCount] = useState([]);
  const [covidKeywordsCount, setCovidKeyWordsCount] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getCovidTimelineCount()
      if (response.status === StatusCodes.OK) {
        setCovidTimeLineCount(response.data)
      }
    };
    fetchData();
  },[])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getCovidKeywordsCount()
      if (response.status === StatusCodes.OK) {
        setCovidKeyWordsCount(response.data)
      }
    };
    fetchData();
  },[])
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const CustomizedLabel: FunctionComponent<any> = (props: any) => {
    const { x, y, stroke, value } = props;
  
    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value}
      </text>
    );
  };

  return (
    <div style={{width: "100%"}}>
      <h3 style={{marginBottom: "16px"}}>Covid-19 and related key words mentioned according to time</h3>
      <ResponsiveContainer  width="100%" height={250}>
        <LineChart
          data={covidTimelineCount}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis width={100} dataKey="time" />
          <YAxis height={100} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" isAnimationActive={false} stroke="#ff7300" dot={{ stroke: '#ff7300', strokeWidth: 1, r: 4,strokeDasharray:''}}>
            <LabelList stroke="#ff7300" content={<CustomizedLabel />} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
      <h3 style={{marginBottom: "16px"}}>Covid-19 related key words mentioned</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            dataKey="value"
            data={covidKeywordsCount}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            label
          >
            {covidKeywordsCount.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
