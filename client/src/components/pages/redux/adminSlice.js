import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    // get all users
    getUsers: {
      isFetching: false,
      users: null,
      error: false,
    },
    // get all games
    getAllGames: {
      isFetching: false,
      games: null,
      error: false,
    },
    // add new game
    addNewGame: {
      isFetching: false,
      success: false,
      error: false,
    },
  },
  reducers: {
    // get all users
    startGetUsers: (state) => {
      state.getUsers.isFetching = true;
    },
    successGetUsers: (state, action) => {
      state.getUsers.isFetching = false;
      state.getUsers.users = action.payload;
      state.getUsers.error = false;
    },
    failedGetUsers: (state) => {
      state.getUsers.isFetching = false;
      state.getUsers.error = true;
    },

    // get all games
    startGetAllGames: (state) => {
      state.getAllGames.isFetching = true;
      state.getAllGames.error = false;
    },
    successGetAllGames: (state, action) => {
      state.getAllGames.isFetching = false;
      state.getAllGames.games = action.payload;
      state.getAllGames.error = false;
    },
    failedGetAllGames: (state) => {
      state.getAllGames.isFetching = false;
      state.getAllGames.error = true;
    },

    // add new game
    startAddNewGame: (state) => {
      state.addNewGame.isFetching = true;
    },
    successAddNewGame: (state) => {
      state.addNewGame.isFetching = false;
      state.addNewGame.success = true;
      state.addNewGame.error = false;
    },
    failedAddNewGame: (state) => {
      state.addNewGame.isFetching = false;
      state.addNewGame.success = false;
      state.addNewGame.error = true;
    },
  },
});

export const {
  startGetUsers,
  successGetUsers,
  failedGetUsers,
  startGetAllGames,
  successGetAllGames,
  failedGetAllGames,
  startAddNewGame,
  successAddNewGame,
  failedAddNewGame,
} = adminSlice.actions;

export default adminSlice.reducer;
