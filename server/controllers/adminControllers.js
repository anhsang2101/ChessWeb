const Game = require('../models/Game');
const User = require('../models/User');

const adminControllers = {

  // get all users
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // delete user
  deleteUsers: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("deleted user successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // get all games
  getAllGames: async (req, res) => {
    try {
      const game = await Game.find();
      return res.status(200).json(game);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // delete user
    deleteGame: async (req, res) => {
      try {
        await Game.findByIdAndDelete(req.params.id);
        res.status(200).json('deleted game successfully');
      } catch (error) {
        res.status(500).json(error);
      }
    },

  // add new game
  addNewGame: async (req, res) => {
    const game = req.body;
    const newGame = new Game({
      player1: game.player1,
      player2: game.player2,
      wonPlayer: game.wonPlayer,
      moves: game.moves,
      date: game.date,
      history: game.history,
    });
    try {
      // console.log('new game: ', newGame);
      const game = await newGame.save();
      return res.status(200).json(game);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

module.exports = adminControllers;
