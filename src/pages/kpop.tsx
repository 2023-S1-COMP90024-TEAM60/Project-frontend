import { getGenderGroupData, getKpopAllGroupData } from "@/utils/api/api";
import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Kpop() {
  const [kpopGroup,setKpopGroup] = useState([]);
  const [genderGroup, setGenderGroup] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const response = await getKpopAllGroupData()
      if (response.status === StatusCodes.OK) {
        setKpopGroup(response.data)
      }
    };
    fetchData();
  },[])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getGenderGroupData()
      if (response.status === StatusCodes.OK) {
        setGenderGroup(response.data)
      }
    };
    fetchData();
  },[])
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384','#9966FF']
  return (
    <>
      <Head>
        <title>Kpop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{width: "100%"}}>
        <h3 style={{marginBottom: "16px", textAlign: 'center'}}>Top 6 kpop groups</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart
            margin={{
              bottom: 50,
            }}>
            <Pie
              dataKey="count"
              data={kpopGroup}
              cx="50%"
              cy="50%"
              outerRadius={130}
              fill="#8884d8"
              paddingAngle={5}
              label
            >
              {kpopGroup.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend/>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <h3 style={{marginBottom: "16px", textAlign: 'center'}}>Group mentioned according to gender</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            width={500}
            height={300}
            data={genderGroup}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value.boys" name="boys" fill="#8884d8" />
            <Bar dataKey="value.girls" name="girls" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
