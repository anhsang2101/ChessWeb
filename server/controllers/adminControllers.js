const Game = require('../models/Game');

const adminControllers = {
  // get all games
  getAllGames: async (req, res) => {
    try {
      const allGames = await Game.find();
      return res.status(200).json(allGames);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // delete user
  //   deleteGame: async (req, res) => {
  //     try {
  //       await Game.findByIdAndDelete(req.id);
  //       res.status(200).json('deleted game successfully');
  //     } catch (error) {
  //       res.status(500).json(error);
  //     }
  //   },

  // add new game
//   addNewGame: async (req, res) => {
//     try {
//       const newGame = await new Game({});
//       const game = await newGame.save();
//       return res.status(200).json(game);
//     } catch (error) {
//       return res.status(500).json(error);
//     }
//   },
};

module.exports = adminControllers;
