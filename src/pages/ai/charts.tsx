import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { StatusCodes } from "http-status-codes";
import { Row, Col } from 'antd';
import type { MenuProps } from 'antd';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import { ageKey, genderKey, educationLevelKey, languageKey, colorCode } from '@/constants/charts';

import { getAllLgaInfo, getAICount, getSudoLocationInfo } from "@/utils/api/api";
import { translateStateLgaToLga } from '@/utils/functions/charts';
import LocationFilter from "@/components/common/LocationFilter";
import styles from "@/pages/ai/charts.module.scss";

function getDistributionData(typeKey: any, totalKey: string, aiCountData: any, sudoLocationInfoData: any, selectedState: Number) {
  const data = [];
  if (Object.keys(aiCountData).length && Object.keys(sudoLocationInfoData).length) {
    for (let i in typeKey) {
      const data_point: any = {
        name: typeKey[i]["name"]
      }
      for (let loc_code in aiCountData["ai_count"]) {
        if (selectedState != 0) {
          const lga_code = translateStateLgaToLga(loc_code);
          data_point[lga_code] = (
            sudoLocationInfoData["lga_data"][lga_code][typeKey[i]["id"]]
            / sudoLocationInfoData["lga_data"][lga_code][totalKey] * 100
          );
        } else {
          data_point[loc_code] = (
            sudoLocationInfoData["state_data"][loc_code][typeKey[i]["id"]]
            / sudoLocationInfoData["state_data"][loc_code][totalKey] * 100
          );
        }
      }
      data.push(data_point)
    }
  }
  return data;
}

export default function AICharts() {
  const [lgaInfo, setLgaInfo]: any = useState({});
  const [aiCount, setAiCount]: any = useState({});
  const [sudoLocationInfo, setSudoLocationInfo]: any = useState({});
  const [aiCountDataVersion, setAiCountDataVersion]: any = useState(uuidv4());
  const [selectedState, setSelectedState] = useState(0);
  useEffect(() => {
    const fetchLgaInfoData = async () => {
      const response = await getAllLgaInfo()
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        setLgaInfo(data);
      }
    };
    fetchLgaInfoData();
  }, [])

  useEffect(() => {
    let selectedStateCode: any = undefined;
    if (selectedState != 0) {
      selectedStateCode = selectedState;
    }

    const fetchAICountData = async () => {
      const response = await getAICount(selectedStateCode, 3)
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        setAiCount(data);
        return data;
      }
    };
    const fetchSudoLocationInfo = async (stateCodes: string[], lgaCodes: string[]) => {
      const response = await getSudoLocationInfo(stateCodes, lgaCodes)
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        setSudoLocationInfo(data);
        setAiCountDataVersion(uuidv4());
      }
    };
    fetchAICountData().then(async (data) => {
      const codes: string[] = []
      for (let k in data["ai_count"]) {
        if (selectedState != 0) {
          const lga_code = JSON.parse(k.replace(/'/g, '"'))[1];
          codes.push(lga_code);
        } else {
          codes.push(k);
        }

      }
      if (selectedState != 0) {
        fetchSudoLocationInfo([], codes);
      } else {
        fetchSudoLocationInfo(codes, []);
      }
    });
  }, [selectedState])

  const handleStateMenuClick: MenuProps['onClick'] = async (e) => {
    setSelectedState(parseInt(e.key))
  }

  const ageData = useMemo(() => {
    return getDistributionData(ageKey, "total_age", aiCount, sudoLocationInfo, selectedState);
  }, [aiCountDataVersion]);

  const renderAgeGraph = useMemo(() => {
    if (ageData.length > 0 && Object.keys(lgaInfo).length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ageData}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={tick => `${tick}%`} />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}%`} />
            <Legend />
            {selectedState != 0 &&
              Object.keys(aiCount["ai_count"]).map((key, index) => {
                return <Bar key={translateStateLgaToLga(key)} name={lgaInfo["suburbs"][translateStateLgaToLga(key)]["name"]} dataKey={translateStateLgaToLga(key)} fill={colorCode[index]} />
              })
            }
            {selectedState == 0 &&
              Object.keys(aiCount["ai_count"]).map((key, index) => <Bar key={key} name={lgaInfo["states"][key]} dataKey={key} fill={colorCode[index]} />)
            }
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }, [ageData, lgaInfo])

  const genderData = useMemo(() => {
    return getDistributionData(genderKey, "total_gender", aiCount, sudoLocationInfo, selectedState);
  }, [aiCountDataVersion]);

  const renderGenderGraph = useMemo(() => {
    if (genderData.length > 0 && Object.keys(lgaInfo).length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={genderData}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" />
            <YAxis
              type="number"
              tickFormatter={tick => `${tick}%`}
              width={100}
            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}%`} />
            <Legend />
            {selectedState != 0 &&
              Object.keys(aiCount["ai_count"]).map((key, index) => {
                return <Bar key={translateStateLgaToLga(key)} name={lgaInfo["suburbs"][translateStateLgaToLga(key)]["name"]} dataKey={translateStateLgaToLga(key)} fill={colorCode[index]} />
              })
            }
            {selectedState == 0 &&
              Object.keys(aiCount["ai_count"]).map((key, index) => <Bar key={key} name={lgaInfo["states"][key]} dataKey={key} fill={colorCode[index]} />)
            }
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }, [ageData, lgaInfo])

  const educationLevelData = useMemo(() => {
    return getDistributionData(educationLevelKey, "total_edu", aiCount, sudoLocationInfo, selectedState);
  }, [aiCountDataVersion]);

  const renderEducationLevelGraph = useMemo(() => {
    if (educationLevelData.length > 0 && Object.keys(lgaInfo).length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={educationLevelData}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" />
            <YAxis
              type="number"
              tickFormatter={tick => `${tick}%`}
              width={100}
            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}%`} />
            <Legend />
            {selectedState != 0 &&
              Object.keys(aiCount["ai_count"]).map((key, index) => {
                return <Bar key={translateStateLgaToLga(key)} name={lgaInfo["suburbs"][translateStateLgaToLga(key)]["name"]} dataKey={translateStateLgaToLga(key)} fill={colorCode[index]} />
              })
            }
            {selectedState == 0 &&
              Object.keys(aiCount["ai_count"]).map((key, index) => <Bar key={key} name={lgaInfo["states"][key]} dataKey={key} fill={colorCode[index]} />)
            }
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }, [ageData, lgaInfo])

  const languageData = useMemo(() => {
    return getDistributionData(languageKey, "total_lang", aiCount, sudoLocationInfo, selectedState);
  }, [aiCountDataVersion]);

  const renderLanguageGraph = useMemo(() => {
    if (languageData.length > 0 && Object.keys(lgaInfo).length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={languageData}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" />
            <YAxis
              type="number"
              tickFormatter={tick => `${tick}%`}
              width={100}
            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}%`} />
            <Legend />
            {selectedState != 0 &&
              Object.keys(aiCount["ai_count"]).map((key, index) => {
                return <Bar key={translateStateLgaToLga(key)} name={lgaInfo["suburbs"][translateStateLgaToLga(key)]["name"]} dataKey={translateStateLgaToLga(key)} fill={colorCode[index]} />
              })
            }
            {selectedState == 0 &&
              Object.keys(aiCount["ai_count"]).map((key, index) => <Bar key={key} name={lgaInfo["states"][key]} dataKey={key} fill={colorCode[index]} />)
            }
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }, [ageData, lgaInfo])

  return (
    <>
      <Head>
        <title>AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LocationFilter
        suburbs={lgaInfo["suburbs"]}
        states={lgaInfo["states"]}
        selectedState={selectedState}
        handleStateMenuClick={handleStateMenuClick}
      />

      <Row gutter={[16, 16]} style={{ minHeight: "50vh" }}>
        <Col span={12}>
          {ageData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Age distribution of top 3 ${selectedState == 0 ? "states" : "suburbs"}`}</h3>
              {renderAgeGraph}
            </div>
          }
        </Col>
        <Col span={12}>
          {genderData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Gender distribution of top 3 ${selectedState == 0 ? "states" : "suburbs"}`}</h3>
              {renderGenderGraph}
            </div>
          }
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ minHeight: "50vh" }}>
        <Col span={12}>
          {educationLevelData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Education level distribution of top 3 ${selectedState == 0 ? "states" : "suburbs"}`}</h3>
              {renderEducationLevelGraph}
            </div>
          }
        </Col>
        <Col span={12}>
          {languageData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Language distribution of top 3 ${selectedState == 0 ? "states" : "suburbs"}`}</h3>
              {renderLanguageGraph}
            </div>
          }
        </Col>
      </Row>
    </>
  );
}
