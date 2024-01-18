const adminControllers = require("../controllers/adminControllers");

const router = require("express").Router();

// get all users
router.get('/users', adminControllers.getAllUsers);
// delete user
router.delete("/deleteuser/:id", adminControllers.deleteUsers);
// get all games
router.get('/games', adminControllers.getAllGames);
// add new game
router.post('/addnewgame', adminControllers.addNewGame);
// delete game
router.delete("/deletegame/:id", adminControllers.deleteGame);

module.exports = router;