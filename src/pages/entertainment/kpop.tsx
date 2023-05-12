import { getKpopAllGroupData } from "@/utils/api/api";
import { StatusCodes } from "http-status-codes";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function Kpop() {
  const [kpopGroup,setKpopGroup] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await getKpopAllGroupData()
      if (response.status === StatusCodes.OK) {
        setKpopGroup(response.data)
      }
    };
    fetchData();
  },[])
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <>
      <Head>
        <title>Kpop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{width: "100%"}}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              dataKey="count"
              data={kpopGroup}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              label
            >
              {kpopGroup.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
