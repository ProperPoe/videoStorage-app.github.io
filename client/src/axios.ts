import axios from "axios";
import { useNavigate } from "react-router-dom";

export const makeRequest = axios.create({
    // baseURL: "http://localhost:4000/api",
    baseURL: "https://clip-flow-c44deb5c5c24.herokuapp.com/api",
    withCredentials: true,
})

makeRequest.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {

        console.log('User is not authenticated. Logging out...');
        localStorage.removeItem('currentUser')

      }
      return Promise.reject(error);
    }
  );