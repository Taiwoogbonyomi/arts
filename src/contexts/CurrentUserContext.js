import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
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

  
  // Function to refresh the token
  // Use useCallback to prevent function recreation
  const refreshToken = useCallback(async () => {
    try {
      const { data } = await axios.post("/dj-rest-auth/token/refresh/");
      localStorage.setItem("accessToken", data.access); // Store new token
      axios.defaults.headers["Authorization"] = `Bearer ${data.access}`;
      return data.access;
    } catch (err) {
      setCurrentUser(null);
      localStorage.removeItem("accessToken"); // Clear token if refresh fails
      history.push("/signin");
      return null;
    }
  }, [history]);

  // Fetch the current user on mount
  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get("/dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    axiosRes.interceptors.response.use(
      (response) => response,
      async (err) => {
        if (err.response?.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            err.config.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(err.config);
          }
        }
        return Promise.reject(err);
      }
    );
  }, [refreshToken]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
