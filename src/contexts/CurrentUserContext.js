import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router-dom";

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();

  // Handle fetching current user when component mounts
  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
      // If user isn't logged in, you could handle a fallback here (like redirecting)
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        // Check if the user is logged in before trying to refresh the token
        if (currentUser) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
          } catch (err) {
            setCurrentUser(null);
            history.push("/signin");
          }
        }
        return config;
      },
      (err) => {
        return Promise.reject(err);
      }
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          try {
            // Refresh the token
            const { data } = await axios.post("/dj-rest-auth/token/refresh/");
            // Update the access token (you can store it in cookies, localStorage, or in state)
            axios.defaults.headers['Authorization'] = `Bearer ${data.access}`;
          } catch (err) {
            setCurrentUser(null);  // If token refresh fails, log out
            history.push("/signin");
          }
          return axios(err.config);  // Retry original request after refresh
        }
        return Promise.reject(err);
      }
    );
  }, [history, currentUser]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
