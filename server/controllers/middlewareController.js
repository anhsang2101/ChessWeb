const jwt = require('jsonwebtoken');

const middlewareController = {
  // verify token
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(' ')[1];
      jwt.verify(accessToken, process.env.ACCESS_KEY, (error, user) => {
        if (error) return res.status(403).json('Token is not Valid');

        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You're not authenticated");
    }
  },

  // check if you are admin
  adminAuthentication: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.admin) {
        next();
      } else return res.status(403).json("You do not have permission");
    });
  },
};

module.exports = middlewareController;
