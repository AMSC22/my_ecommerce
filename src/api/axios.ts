import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
//import Cookies from 'js-cookie';

const apiAxios = (BASE_URL: string): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      accept: 'application/json',
    },
  });

  api.interceptors.request.use((request) => {
    request.headers = {
      ...request.headers, // Préservez les headers existants
      Authorization: 'Bearer ', //+ Cookies.get('access_token') || '',
    } as AxiosRequestHeaders;

    return request;
  });

  return api;
};



export default apiAxios;
