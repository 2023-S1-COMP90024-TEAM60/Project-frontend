import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { StatusCodes } from "http-status-codes";
import { Row, Col, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, LabelList } from 'recharts';
import { v4 as uuidv4 } from 'uuid';
import { ageKey, genderKey, educationLevelKey, languageKey, colorCode, stackedChartColorCode } from '@/constants/charts';

import { getAllLgaInfo, getAICount, getSudoLocationInfo, getAILangCount } from "@/utils/api/api";
import { translateStateLgaToLga } from '@/utils/functions/charts';
import LocationFilter from "@/components/common/LocationFilter";
import styles from "@/pages/ai/charts.module.scss";

function getDistributionData(typeKey: any, totalKey: string, aiCountData: any, sudoLocationInfoData: any, selectedState: Number) {
  const data = [];
  if (Object.keys(aiCountData).length && Object.keys(sudoLocationInfoData).length) {
    for (const i in typeKey) {
      const data_point: any = {
        name: typeKey[i]["name"]
      }
      for (const loc_code in aiCountData["ai_count"]) {
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

function getLanguageDistributionData(typeKey: any, totalKey: string, langCountData: any, sudoLocationInfoData: any, lgaInfo: any, selectedState: Number, isEng = true) {
  const data: any = [];
  if (Object.keys(lgaInfo).length == 0) {
    return data;
  }
  let typeKeyIndex = 0;
  let lang_code = "en";
  if (!isEng) {
    typeKeyIndex = 1
    lang_code = "non_en";
  }
  console.log(langCountData)
  if (Object.keys(langCountData).length && Object.keys(sudoLocationInfoData).length) {

    let loc_data_type = "state_data";
    let loca_type = "states";
    if (selectedState != 0) {
      loc_data_type = "lga_data";
      loca_type = "suburbs";
    }
    for (const loc_code in langCountData[loc_data_type]) {
      const data_point: any = {}
      data_point["name"] = lgaInfo[loca_type][loc_code]["name"];
      data_point["location_lang_count"] = (
        sudoLocationInfoData[loc_data_type][loc_code][typeKey[typeKeyIndex]["id"]]
        / sudoLocationInfoData[loc_data_type][loc_code][totalKey] * 100
      );
      data_point[`tweet_lang_count`] = (
        langCountData[loc_data_type][loc_code][lang_code]
        / langCountData[loc_data_type][loc_code]["tot"] * 100
      );
      data.push(data_point)
    }
  }
  return data;
}

function getStackChartDistributiondData(typeKey: any, totalKey: string, aiCountData: any, sudoLocationInfoData: any, lgaInfo: any, selectedState: Number) {
  const data: any = [];
  if (Object.keys(lgaInfo).length == 0) {
    return data;
  }
  if (Object.keys(aiCountData).length && Object.keys(sudoLocationInfoData).length) {
    for (let loc_code in aiCountData["ai_count"]) {
      const data_point: any = {
      }
      let loc_data_type = "state_data";
      let loca_type = "states";
      if (selectedState != 0) {
        loc_data_type = "lga_data";
        loca_type = "suburbs";
        loc_code = translateStateLgaToLga(loc_code).toString();
      }
      data_point["name"] = lgaInfo[loca_type][loc_code]["name"];
      for (const i in typeKey) {
        data_point[typeKey[i]["id"]] = (
          sudoLocationInfoData[loc_data_type][loc_code][typeKey[i]["id"]]
          / sudoLocationInfoData[loc_data_type][loc_code][totalKey] * 100
        );
      }
      data.push(data_point)
    }

  }
  return data;
}

export default function AICharts() {
  const [lgaInfo, setLgaInfo]: any = useState({});
  const [aiTweetsCount, setAiTweetsCount]: any = useState({});
  const [aiLangCount, setAiLangCount]: any = useState({});
  const [sudoLocationInfo, setSudoLocationInfo]: any = useState({});
  const [aiCountDataVersion, setAiCountDataVersion]: any = useState(uuidv4());
  const [selectedState, setSelectedState] = useState(0);
  useEffect(() => {
    const fetchLgaInfoData = async () => {
      const response = await getAllLgaInfo();
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
      const response = await getAICount(selectedStateCode, 3);
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        setAiTweetsCount(data);
        return data;
      }
    };
    const fetchAILangCountData = async (stateCodes: string[], lgaCodes: string[]) => {
      const response = await getAILangCount(stateCodes, lgaCodes);
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        return data;
      }
    };
    const fetchSudoLocationInfo = async (stateCodes: string[], lgaCodes: string[]) => {
      const response = await getSudoLocationInfo(stateCodes, lgaCodes);
      if (response.status === StatusCodes.OK) {
        const data = response.data;
        return data;
      }
    };
    fetchAICountData().then(async (data) => {
      const codes: string[] = []
      for (const k in data["ai_count"]) {
        if (selectedState != 0) {
          const lga_code = JSON.parse(k.replace(/'/g, '"'))[1];
          codes.push(lga_code);
        } else {
          codes.push(k);
        }
      }
      const promises = [];
      if (selectedState != 0) {
        promises.push(new Promise(async (resolve, reject) => {
          const data = await fetchSudoLocationInfo([], codes);
          resolve(data);
        }));
        promises.push(new Promise(async (resolve, reject) => {
          const data = await fetchAILangCountData([], codes);
          resolve(data);
        }));
      } else {
        promises.push(new Promise(async (resolve, reject) => {
          const data = await fetchSudoLocationInfo(codes, []);
          resolve(data);
        }));
        promises.push(new Promise(async (resolve, reject) => {
          const data = await fetchAILangCountData(codes, []);
          resolve(data);
        }));
      }
      Promise.all(promises).then((results) => {
        setSudoLocationInfo(results[0]);
        setAiLangCount(results[1]);
        setAiCountDataVersion(uuidv4());
      });
    });
  }, [selectedState])
  const handleStateMenuClick: MenuProps['onClick'] = async (e) => {
    setSelectedState(parseInt(e.key))
  }

  const ageData = useMemo(() => {
    return getStackChartDistributiondData(ageKey, "total_age", aiTweetsCount, sudoLocationInfo, lgaInfo, selectedState);
  }, [aiCountDataVersion, lgaInfo]);

  const renderAgeGraph = useMemo(() => {
    if (ageData.length > 0 && Object.keys(lgaInfo).length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={ageData}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" />
            <YAxis
              type="number"
              tickFormatter={tick => `${tick}%`}
              width={100}
              domain={[0, 100]}
              allowDataOverflow={true}
            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}%`} />
            <Legend />
            {
              ageKey.map((item, index) => {
                return <Bar stackId={"a"} key={index} name={item["name"]} dataKey={item["id"]} fill={stackedChartColorCode[index]} />
              })
            }
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }, [ageData, lgaInfo])

  const educationLevelData = useMemo(() => {
    return getDistributionData(educationLevelKey, "total_edu", aiTweetsCount, sudoLocationInfo, selectedState);
  }, [aiCountDataVersion]);

  const renderEducationLevelGraph = useMemo(() => {
    if (educationLevelData.length > 0 && Object.keys(lgaInfo).length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={educationLevelData}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis dataKey="name" type="category" width={100} />
            <XAxis
              type="number"
              tickFormatter={tick => `${tick}%`}

            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}%`} />
            <Legend />
            {selectedState != 0 &&
              Object.keys(aiTweetsCount["ai_count"]).map((key, index) => {
                return <Bar key={translateStateLgaToLga(key)} name={lgaInfo["suburbs"][translateStateLgaToLga(key)]["name"]} dataKey={translateStateLgaToLga(key)} fill={colorCode[index]} >
                </Bar>
              })
            }
            {selectedState == 0 &&
              Object.keys(aiTweetsCount["ai_count"]).map((key, index) => <Bar key={key} name={lgaInfo["states"][key]["name"]} dataKey={key} fill={colorCode[index]} />)
            }
          </BarChart>
        </ResponsiveContainer>
      )
    }
  }, [ageData, lgaInfo])

  const languageData = useMemo(() => {
    return getDistributionData(languageKey, "total_lang", aiTweetsCount, sudoLocationInfo, selectedState);
  }, [aiCountDataVersion]);

  const englishLanguageData = useMemo(() => {
    return getLanguageDistributionData(languageKey, "total_lang", aiLangCount, sudoLocationInfo, lgaInfo, selectedState);
  }, [aiCountDataVersion, lgaInfo]);

  const renderEnglishLanguageGraph = useMemo(() => {
    if (englishLanguageData.length > 0 && Object.keys(lgaInfo).length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={englishLanguageData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" />
            <YAxis
              type="number"
              tickFormatter={tick => `${tick}%`}
              width={100}
            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}%`} />
            <Bar dataKey={"location_lang_count"} name={"% english language"}>
              {englishLanguageData.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={colorCode[index]} />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="tweet_lang_count"
              stroke="#ff7300"
              name="% tweets written in English"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={true}
            />
          </ComposedChart>
        </ResponsiveContainer>

      )
    }
  }, [ageData, lgaInfo])

  const otherLanguageData = useMemo(() => {
    return getLanguageDistributionData(languageKey, "total_lang", aiLangCount, sudoLocationInfo, lgaInfo, selectedState, false);
  }, [aiCountDataVersion, lgaInfo]);

  const renderOtherLanguageGraph = useMemo(() => {
    if (otherLanguageData.length > 0 && Object.keys(lgaInfo).length > 0) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={otherLanguageData}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" />
            <YAxis
              type="number"
              tickFormatter={tick => `${tick}%`}
              width={100}
            />
            <Tooltip formatter={(value) => `${Number(value).toFixed(2).toString()}%`} />
            <Bar dataKey={"location_lang_count"} name={"% other languages"}>
              {englishLanguageData.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={colorCode[index]} />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="tweet_lang_count"
              stroke="#ff7300"
              name="% tweets written in other languages"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={true}
            />
          </ComposedChart>
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
        states={lgaInfo["states"]}
        selectedState={selectedState}
        handleStateMenuClick={handleStateMenuClick}
      />

      <Row gutter={[16, 16]} style={{ minHeight: "50vh" }}>
        <Col span={12}>
          {ageData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Age distribution of the top 3 ${selectedState == 0 ? "states" : "suburbs"}`}</h3>
              {renderAgeGraph}
            </div>
          }
          {ageData.length == 0 &&
            <Skeleton active />
          }
        </Col>
        <Col span={12}>
          {educationLevelData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Education level distribution of the top 3 ${selectedState == 0 ? "states" : "suburbs"}`}</h3>
              {renderEducationLevelGraph}
            </div>
          }
          {educationLevelData.length == 0 &&
            <Skeleton active />
          }
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ minHeight: "50vh" }}>
        <Col span={12}>
          {languageData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`English Language Usage of the top 3 ${selectedState == 0 ? "states" : "suburbs"}: A Comparative Analysis of Spoken Conversations and Twitter Activity`}</h3>
              {renderEnglishLanguageGraph}
            </div>
          }
          {languageData.length == 0 &&
            <Skeleton active />
          }
        </Col>
        <Col span={12}>
          {languageData.length > 0 &&
            <div style={{ height: "60vh" }} className={styles.chart}>
              <h3>{`Non-English Language Usage of the top 3 ${selectedState == 0 ? "states" : "suburbs"}: A Comparative Analysis of Spoken Conversations and Twitter Activity`}</h3>
              {renderOtherLanguageGraph}
            </div>
          }
          {languageData.length == 0 &&
            <Skeleton active />
          }
        </Col>
      </Row>
    </>
  );
}
