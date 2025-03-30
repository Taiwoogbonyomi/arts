import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { axiosReq } from "../api/axiosDefaults";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
  
      pageProfile: { results: [] },
      popularProfiles: { results: [] },
    });

    useEffect(() => {
        const handleMount = async () => {
          try {
            const { data } = await axiosReq.get(
              "/profiles/?ordering=-followers_count"
            );
            setProfileData((prevState) => ({
              ...prevState,
              popularProfiles: data,
            }));
          } catch (err) {
          }
        };
    
        handleMount();
      }, [currentUser]);
    
      return (
        <ProfileDataContext.Provider value={profileData}>
          <SetProfileDataContext.Provider value={{ setProfileData, handleFollow, handleUnfollow }}>
            {children}
          </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
      );
    };
    
  