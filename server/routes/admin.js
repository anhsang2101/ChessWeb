const adminControllers = require("../controllers/adminControllers");
const middlewareController = require("../controllers/middlewareController");
const userControllers = require("../controllers/userControllers");

const router = require("express").Router();

// get all users
router.get('/users', middlewareController.adminAuthentication, userControllers.getAllUsers);
// get all games
router.get('/games', middlewareController.adminAuthentication, adminControllers.getAllGames);
// add new game
router.post('/addnewgame', middlewareController.adminAuthentication, adminControllers.getAllGames);

module.exports = router;