import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'admin',
  initialState: {
    // get all users
    getUsers: {
      isFetching: false,
      users: [],
      error: false,
    },

    // get all games
    getGames: {
      isFetching: false,
      games: [],
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
    startGetGames: (state) => {
      state.getGames.isFetching = true;
    },
    successGetGames: (state, action) => {
      state.getGames.isFetching = false;
      state.getGames.games = action.payload;
      state.getGames.error = false;
    },
    failedGetGames: (state) => {
      state.getGames.isFetching = false;
      state.getGames.error = true;
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
  startGetGames,
  successGetGames,
  failedGetGames,
  startAddNewGame,
  successAddNewGame,
  failedAddNewGame
} = userSlice.actions;

export default userSlice.reducer;
