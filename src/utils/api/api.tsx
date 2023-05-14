import axios from 'axios';

const baseUrl = 'http://localhost:8000';

export const getAIData = () => axios(`${baseUrl}/ai/aiData`, {
  method: 'GET',
});

export const getSentimentData = (needLoc = true) => axios(`${baseUrl}/lga/sentimentData`, {
  method: 'GET',
  params: {
    need_loc: needLoc,
  }
});

export const getAllLgaInfo = () => axios(`${baseUrl}/lga/lgaInfo`, {
  method: 'GET',
});

export const getAICount = (stateCode: number, top: number) => axios(`${baseUrl}/ai/tweetsCount`, {
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

  return axios(`${baseUrl}/ai/langCount`, {
    method: 'GET',
    params: params
  });
}

export const getAustraliaSentimentTimeline = () => axios(`${baseUrl}/sentiment/timelineCount`, {
  method: 'GET',
});
export const getCovidTimelineCount = () => axios(`${baseUrl}/mastodon/covid/timelineCount`, {
  method: 'GET',
});

export const getCovidKeywordsCount = () => axios(`${baseUrl}/mastodon/covid/keywordsCount`, {
  method: 'GET',
});

export const getKpopAllGroupData = () => axios(`${baseUrl}/kpop/allGroup`, {
  method: 'GET',
});

export const getGenderGroupData = () => axios(`${baseUrl}/kpop/genderGroup`, {
  method: 'GET',
});

export const getTopSentimentLgaPerState = () => axios(`${baseUrl}/sentiment/topLgaPerState`, {
  method: 'GET',
});
