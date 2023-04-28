import axios from 'axios';

const baseUrl = 'http://localhost:8000/api/v1';

export const getDoc = (value: string) => axios(`${baseUrl}/docs/${value}`, {
  method: 'GET',
});
