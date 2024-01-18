const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

let refreshTokens = [];

const authControllers = {
  // register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });

      // save to db
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // generate access key
  generateAccesskey: (user) => {
    const payload = {
      id: user.id,
      admin: user.admin,
    };
    const accessKey = process.env.ACCESS_KEY;

    // create access token
    const accessToken = jwt.sign(payload, accessKey, { expiresIn: '30d' });
    return accessToken;
  },

  // generate refresh key
  generateRefreshkey: (user) => {
    const payload = {
      id: user.id,
      admin: user.admin,
    };
    const refreshKey = process.env.REFRESH_KEY;

    // create refresh token
    const refreshToken = jwt.sign(payload, refreshKey, { expiresIn: '30d' });
    return refreshToken;
  },

  // login
  loginUser: async (req, res) => {
    try {
      const errMessage = 'Email Address Or Password are Invalid';
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json(errMessage);
      }

      const password = await bcrypt.compare(req.body.password, user.password);
      if (!password) {
        return res.status(404).json(errMessage);
      }

      if (user && password) {
        // create access token
        const accessToken = authControllers.generateAccesskey(user);

        // create refresh token
        const refreshToken = authControllers.generateRefreshkey(user);
        refreshTokens.push(refreshToken);

        // store refresh cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
        });

        // remove password from information's user
        const { password, ...others } = user._doc;

        return res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // refresh token
  refreshToken: async (req, res) => {
    // get refresh from cookie's user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authentication");

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json('refresh token is not valid');
    }

    // verify refresh token of user
    jwt.verify(refreshToken, process.env.REFRESH_KEY, (error, user) => {
      if (error) console.log(error);

      // create new access token and refresh token
      const newAccessToken = authControllers.generateAccesskey(user);
      const newRefreshToken = authControllers.generateRefreshkey(user);

      // remove current refresh token out of refreshTokens and add new refresh token
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      refreshTokens.push(newRefreshToken);

      // store refresh cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: '/',
        sameSite: 'strict',
      });

      return res.status(200).json({ accessToken: newAccessToken });
    });
  },

  // logout
  logoutUser: async (req, res) => {
    // delete refresh token in Cookie and array refreshTokens
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.clearCookie('refreshToken');

    return res.status(200).json('Logout successfully!');
  },
};

module.exports = authControllers;
