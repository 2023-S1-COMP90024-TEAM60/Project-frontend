import axios from 'axios';

const baseUrl = 'http://localhost:8000';

export const getAIData = () => axios(`${baseUrl}/AI/mapData`, {
  method: 'GET',
});

export const getSentimentData = () => axios('https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson', {
  method: 'GET',
});
