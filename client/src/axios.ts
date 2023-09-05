import axios from "axios";
import { useNavigate } from "react-router-dom";

export const makeRequest = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true,
})

makeRequest.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle the 401 error here
        // Log the user out of local storage or perform any other action
        // const navigate = useNavigate()

        // navigate('/')
        console.log('User is not authenticated. Logging out...');
        localStorage.removeItem('currentUser')

        
        // For example, you can dispatch a Redux action to log the user out
        // dispatch(logoutAction());
  
        // Redirect the user to the login page or perform any other action
        // history.push('/login');
      }
      return Promise.reject(error);
    }
  );