const middlewareController = require("../controllers/middlewareController");
const userControllers = require("../controllers/userControllers");

const router = require("express").Router();

// get all users
router.get("/", middlewareController.verifyToken, userControllers.getAllUsers);
// delete a user
router.delete("/:id", middlewareController.adminAuthentication, userControllers.deleteUsers);

module.exports = router;