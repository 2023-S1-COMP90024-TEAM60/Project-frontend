import axios from 'axios';

const baseUrl = 'http://localhost:8000';

export const getAIData = () => axios(`${baseUrl}/AI/mapData`, {
  method: 'GET',
});
