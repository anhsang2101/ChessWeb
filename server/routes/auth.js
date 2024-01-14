const router = require("express").Router();

const authControllers = require("../controllers/authControllers");

// register
router.post("/register", authControllers.registerUser);

// login
router.post("/login", authControllers.loginUser);

// refresh token
router.post("/refreshtoken", authControllers.refreshToken);

// logout
router.post("/logout", authControllers.logoutUser);


module.exports = router;