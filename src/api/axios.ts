import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
//import Cookies from 'js-cookie';

// Créer une instance Axios
const apiAxios = (BASE_URL: string): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      accept: 'application/json',
    },
  });

  // Intercepter chaque réquete envoyée
  api.interceptors.request.use((request) => {
    request.headers = {
      ...request.headers, // Préservez les headers existants
      Authorization: 'Bearer ', //+ Cookies.get('access_token') || '',
    } as AxiosRequestHeaders;

    return request;
  });

  // Intercepter chaque réponse pour récupérer le role
  api.interceptors.response.use((response) => {
    if (response.headers["x-user-role"]) {
      localStorage.setItem("user_id", response.headers["x-user-id"]);
      localStorage.setItem("user_role", response.headers["x-user-role"]);
      // localStorage.setItem("user_role", response.headers["x-user-role"]);
    }
    return response;
  });

  return api;
};



export default apiAxios;
