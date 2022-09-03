const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const { geoCode } = require("../services/Geocoding");
const createError = require("http-errors");
const { allowedUpdates } = require("../DTO/update-User-schema");
const { validationResult } = require("express-validator");
const userCtrl = {
  getUserInfor: async (req, res, next) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      const user = await Users.find().select("-password");
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await Users.findOne({ _id: req.user._id });
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Your old password is wrong.",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters long.",
        });
      }

      if (oldPassword == newPassword)
        return res.status(400).send({ msg: "You must enter a new password" });

      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { password: newPasswordHash }
      );
      res.status(200).json({
        success: true,
        message: "Password updated successfully !",
      });
    } catch (err) {
      next(err);
    }
  },

  deleteAccount: async (req, res, next) => {
    try {
      const user = await Users.findById(req.params.id);
     
        user.remove();

        res.status(200).json({
          success: true,
          message: "Account deleted successfully !",
        });
      
    } catch (err) {
      next(err);
    }
  },

  updateProfile: async (req, res, next) => {
    const query = req.body;
    const updates = Object.keys(query);
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw createError.BadRequest(errors.errors[0].msg);
      }

        //if my quest contain position
        user = await Users.findByIdAndUpdate(req.params.id, query, {
          new: true,
        });
        if (!user) {
          throw createError.BadRequest("User not found");
        }

        return res.status(200).json({
          success: true,
          message: "User Updated:",
          user,
        });
      
    } catch (error) {
      next(error);
    }
  },
};
const uploadImageInDB = async (files, id) => {
  let user;
  for (file of files) {
    user = await Users.findByIdAndUpdate(
      id,
      {
        $push: {
          profilePic: {
            path: "https://kandle-api.com/" + file.path.toString(),
          },
        },
      },
      { new: true, useFindAndModify: false }
    );
  }
  return user;
};

module.exports = userCtrl;
