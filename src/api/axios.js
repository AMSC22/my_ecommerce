// import axios from "axios";
// // import Cookies from "js-cookie";

// // Créer une instance Axios
// const apiAxios = (BASE_URL) => {

//   const api = axios.create({
//     baseURL: BASE_URL,
//     headers: {
//       "accept": "application/json"
//     },
//   })

//   // Intercepter chaque réquete envoyée
//   api.interceptors.request.use(request => {
//     request.headers = {
//       "Authorization": "Bearer " //+ Cookies.get('access_token')
//     }

//     return request
//   })

//   // Intercepter chaque réponse pour récupérer le role
//   api.interceptors.response.use((response) => {
//     if (response.headers["x-user-role"]) {
//       localStorage.setItem("user_role", response.headers["x-user-role"]);
//     }
//     return response;
//   });

//   return api
// }

// export default apiAxios