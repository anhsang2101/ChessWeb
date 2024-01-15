const User = require('../models/User');

const userControllers = {
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
};

module.exports = userControllers;
