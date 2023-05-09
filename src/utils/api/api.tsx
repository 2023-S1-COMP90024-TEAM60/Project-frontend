import axios from 'axios';

const baseUrl = 'http://localhost:8000';

export const getAIData = () => axios(`${baseUrl}/AI/mapData`, {
  method: 'GET',
});

export const getSentimentData = () => axios('https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson', {
  method: 'GET',
});

export const getAllLgaInfo = () => axios(`${baseUrl}/LGA/getAllLgaInfo`, {
  method: 'GET',
});

export const getAICount = (stateCode: number, top: number) => axios(`${baseUrl}/AI/tweetsCount`, {
  method: 'GET',
  params: {
    state_code: stateCode,
    top
  }
});

export const getSudoLocationInfo = (stateCodes: string[], lgaCodes: string[]) => {
  const params = new URLSearchParams();
  for (let i = 0; i < stateCodes.length; i++) {
    params.append("state_codes", stateCodes[i]);
  }
  for (let i = 0; i < lgaCodes.length; i++) {
    params.append("lga_codes", lgaCodes[i]);
  }

  return axios(`${baseUrl}/sudo/getLocationsInfo`, {
    method: 'GET',
    params: params
  });
}

export const getAILangCount = (stateCodes: string[], lgaCodes: string[]) => {
  const params = new URLSearchParams();
  for (let i = 0; i < stateCodes.length; i++) {
    params.append("state_codes", stateCodes[i]);
  }
  for (let i = 0; i < lgaCodes.length; i++) {
    params.append("lga_codes", lgaCodes[i]);
  }

  return axios(`${baseUrl}/AI/langCount`, {
    method: 'GET',
    params: params
  });
}