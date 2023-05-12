import axios from 'axios';

const baseUrl = 'http://localhost:8000';

export const getAIData = () => axios(`${baseUrl}/AI/aiData`, {
  method: 'GET',
});

export const getSentimentData = (needLoc: boolean = true) => axios(`${baseUrl}/LGA/sentimentData`, {
  method: 'GET',
  params: {
    need_loc: needLoc,
  }
});

export const getAllLgaInfo = () => axios(`${baseUrl}/LGA/lgaInfo`, {
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

  return axios(`${baseUrl}/sudo/locationsInfo`, {
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

export const getAustraliaSentimentTimeline = () => axios(`${baseUrl}/Sentiment/timeline`, {
  method: 'GET',
});