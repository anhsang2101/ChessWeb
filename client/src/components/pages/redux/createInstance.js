import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import IPAddress from '../../../IPAddress';

async function refreshToken() {
  try {
    const res = await axios.post(
      `http://${IPAddress}:3001/v1/auth/refreshtoken`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export const createAxios = (user, dispath, stateSuccess) => {
  const newInstance = axios.create();
  newInstance.interceptors.request.use(
    async (config) => {
      let date = new Date();
      const decodedToken = jwtDecode(user?.accessToken);
      if (decodedToken.exp < date.getTime() / 1000) {
        const newTokens = await refreshToken();
        const refreshUser = {
          ...user,
          accessToken: newTokens.accessToken,
        };
        dispath(stateSuccess(refreshUser));
        config.headers['token'] = 'Bearer' + newTokens.accessToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return newInstance;
};
