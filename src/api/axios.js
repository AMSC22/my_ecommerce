import axios from "axios";
// import Cookies from "js-cookie";

const apiAxios = (BASE_URL) => {

  const api = axios.create({
    baseURL: BASE_URL,
    headers: {
      "accept": "application/json"
    },
  })
  api.interceptors.request.use(request => {
    request.headers = {
      "Authorization": "Bearer " //+ Cookies.get('access_token')
    }

    return request
  })

  return api
}

export default apiAxios