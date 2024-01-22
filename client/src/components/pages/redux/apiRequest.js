import axios from 'axios';
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from './authSlice';
import {
  failedAddNewGame,
  failedGetAllGames,
  failedGetGames,
  failedGetUsers,
  startAddNewGame,
  startGetAllGames,
  startGetGames,
  startGetUsers,
  successAddNewGame,
  successGetAllGames,
  successGetGames,
  successGetUsers,
} from './adminSlice';

import IPAddress from '../../../IPAddress';

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`http://${IPAddress}:3001/v1/auth/login`, user);
    dispatch(loginSuccess(res.data));
    const loginedUser = res.data;
    if (loginedUser.admin === false) navigate('/');
    else navigate('/admin');
  } catch (error) {
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());
  try {
    await axios.post(`http://${IPAddress}:3001/v1/auth/register`, user);
    dispatch(registerSuccess());
    navigate('/login');
  } catch (error) {
    dispatch(registerFailed());
  }
};

export const logoutUser = async (
  id,
  accessToken,
  dispatch,
  navigate,
  axiosJWT
) => {
  dispatch(logoutStart());
  try {
    await axios.post(`http://${IPAddress}:3001/v1/auth/logout`, id, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(logoutSuccess());
    navigate('/');
  } catch (error) {
    dispatch(logoutFailed());
  }
};

export const getAllUsers = async (
  user,
  accessToken,
  dispatch,
  navigate,
  axiosJWT
) => {
  dispatch(startGetUsers());
  try {
    const res = await axios.get(`http://${IPAddress}:3001/admin/users`, user, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(successGetUsers(res.data));
    // navigate('/admin');
  } catch (error) {
    dispatch(failedGetUsers());
  }
};

export const getAllGames = async (
  user,
  accessToken,
  dispatch,
  navigate,
  axiosJWT
) => {
  // dispatch(startGetAllGames());
  try {
    const res = await axios.get(`http://${IPAddress}:3001/admin/games`, user, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(successGetAllGames(res.data));
  } catch (error) {
    // dispatch(failedGetAllGames());
  }
};

export const addNewGame = async (
  game,
  // user,
  // accessToken,
  dispatch
  // axiosJWT
) => {
  // dispatch(startAddNewGame());
  try {
    const res = await axios.post(`http://${IPAddress}:3001/admin/addnewgame`, {
      player1: game.player1,
      player2: game.player2,
      wonPlayer: game.wonPlayer,
      moves: game.moves,
      date: game.data,
      history: game.history,
    });
    dispatch(successAddNewGame(res.data));
  } catch (error) {
    dispatch(failedAddNewGame());
  }
};
