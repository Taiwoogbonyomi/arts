import { createContext, useContext, useEffect, useState, useCallback } from "react";
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

  /** 🔄 Refresh Access Token */
  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) throw new Error("No refresh token available");

      const { data } = await axios.post("/dj-rest-auth/token/refresh/", { refresh });
      localStorage.setItem("accessToken", data.access);
      axios.defaults.headers["Authorization"] = `Bearer ${data.access}`;
      return data.access;
    } catch (err) {
      console.error("Token refresh failed", err);
      setCurrentUser(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken"); 
      history.push("/signin");
      return null;
    }
  }, [history]);

  /** 🎭 Fetch the current user on mount */
  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosRes.get("/dj-rest-auth/user/");
        setCurrentUser(data);
      } catch (err) {
        console.log("User fetch failed", err);
      }
    };
    handleMount();
  }, []);

  /** 🔄 Set up Axios Interceptors */
  useEffect(() => {
    const requestInterceptor = axiosReq.interceptors.request.use(
      async (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = axiosRes.interceptors.response.use(
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

    return () => {
      axiosReq.interceptors.request.eject(requestInterceptor);
      axiosRes.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
