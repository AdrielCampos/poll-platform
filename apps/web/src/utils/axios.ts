import axios from 'axios';

export const httpRequest = axios.create({
  baseURL: 'http://localhost:5050/',
  timeout: 10000,
  headers: { 'X-Custom-Header': 'foobar' },
});
