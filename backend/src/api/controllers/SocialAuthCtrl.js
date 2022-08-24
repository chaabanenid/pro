const bcrypt = require("bcrypt");
const Users = require("../models/userModel");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const generateToken = require("../services/TokenGenerate");
const userGoogle = new OAuth2(process.env.GOOGLE_CLIENT_ID);
const createError = require("http-errors");
const axios = require("axios");
const SocialAuthCtr = {
  googleLogin: async (req, res) => {
    try {
      const { tokenId } = req.body;
      const verify = await userGoogle.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email } = verify.payload;
      const user = await Users.findOne({ email });
      if (!user) {
        console.log("Account not registered!");
        return res.status(404).json({
          success: false,
          message: "Account not registered!",
        });
      } else {
        const access_token = generateToken.createAccessToken({ id: user._id });
        const refresh_token = generateToken.createRefreshToken({
          id: user._id,
        });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/auth/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        console.log("Login success!", access_token);
        res.status(200).json({
          success: true,
          message: "Logged in  Successfully!",
          access_token,
          user: {
            ...user._doc,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  googleSignup: async (req, res) => {
    try {
      const { tokenId } = req.body;
      const verify = await userGoogle.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email, name, picture } = verify.payload;
      const password = email + process.env.GOOGLE_SECRET;
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await Users.findOne({ email });
      if (user) {
        res.status(400).json({
          success: false,
          message: "Existing Account!",
        });
        console.log("Existing Account!");
      } else {
        const newUser = new Users({
          username: name,
          email,
          password: passwordHash,
          profilePic: picture,
        });
        const access_token = generateToken.createAccessToken({
          id: newUser._id,
        });
        const refresh_token = generateToken.createRefreshToken({
          id: newUser._id,
        });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/auth/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        await newUser.save();
        console.log("Signup and login success !", access_token);
        return res.status(200).json({
          success: true,
          message: "Signup and login success !",
          access_token,
          user: {
            ...newUser._doc,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  facebookLogin: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;
      const URL = `https://graph.facebook.com/v13.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
      const data = await axios(URL).then(function (res) {
        return res.data;
      });
      const { email } = data;
      const user = await Users.findOne({ email });
      if (!user) {
        console.log("Account not registered!");
        return res.status(404).json({
          success: false,
          message: "Account not registered!",
        });
      } else {
        const access_token = generateToken.createAccessToken({ id: user._id });
        const refresh_token = generateToken.createRefreshToken({
          id: user._id,
        });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/auth/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        console.log("Login success!", access_token);
        return res.status(200).json({
          success: true,
          message: "Logged in  Successfully!",
          access_token,
          user: {
            ...user._doc,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  facebookSignup: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;
      const URL = `https://graph.facebook.com/v13.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
      const data = await axios(URL).then(function (res) {
        return res.data;
      });
      const { email, name, picture } = data;
      const password = email + process.env.FACEBOOK_SECRET;
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await Users.findOne({ email });
      if (user) {
        console.log("Existing Account!");
        return res.status(400).json({
          success: false,
          message: "Existing Account!",
        });
      } else {
        const newUser = new Users({
          username: name,
          email,
          password: passwordHash,
          profilePic: picture.data.url,
        });
        const access_token = generateToken.createAccessToken({
          id: newUser._id,
        });
        const refresh_token = generateToken.createRefreshToken({
          id: newUser._id,
        });
        res.cookie("refreshtoken", refresh_token, {
          httpOnly: true,
          path: "/api/auth/refresh_token",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        await newUser.save();
        console.log("Signup and login success!", access_token);
        return res.status(200).json({
          success: true,
          message: "Signup and login success !",
          access_token,
          user: {
            ...newUser._doc,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  // if the registration was made in front , so user must be registred and uodated with photos an external attributes
  registerSocialFront: async (req, res) => {
    try {
      const {
        id,
        email,
        password,
        confirmPassword,
        name,
        photo,
        tokenId,
        birthDate,
        age,
      } = req.body;
      const verify = await userGoogle.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      if (!verify) {
        return res.status(403).json({
          success: false,
          message: "Token is not verifyed",
        });
      }
      if (password !== confirmPassword)
        return res.status(405).json({
          success: false,

          message: "Password must be identical",
        });

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await Users.findOne({ idSocial: id });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(402).json({
            success: false,
            message: "Password is incorrect",
          });
        }

        const access_token = generateToken.createAccessToken({
          id: user._id,
        });
        const refresh_token = generateToken.createRefreshToken({
          id: user._id,
        });
        return res.status(200).json({
          success: true,
          message: "User is logged in",
          access_token,
          refresh_token,
          user,
        });
      } else {
        const newUser = new Users({
          email,
          password: passwordHash,
          phoneVerified: false,
          emailVerified: true,
          idSocial: id,
          name,
          birthDate,
          age,
          profilePic: [
            {
              path: "https://i.postimg.cc/8cQHCF55/933-9332131-profile-picture-default-png.jpg",
            },
            {
              path: photo,
            },
          ],
        });
        const access_token = generateToken.createAccessToken({
          id: newUser._id,
        });
        const refresh_token = generateToken.createRefreshToken({
          id: newUser._id,
        });
        const user = await newUser.save();

        return res.status(200).json({
          success: true,
          message: "Registered Successfully ",
          access_token,
          refresh_token,

          user,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  registerFacebook: async (req, res, next) => {
    try {
      const {
        email,
        password,
        confirmPassword,
        name,
        tokenId,
        birthDate,
        age,
      } = req.body;

      const URL = `https://graph.facebook.com/me?access_token=${tokenId}`;

      const data = await axios(URL)
        .then(function (res) {
          return res.data;
        })
        .catch((error) => {
          throw createError[400]("Token is not verifyed");
        });
      if (!data || data == "undefined") {
        throw createError.BadRequest("Token is not verifyed");
      }

      const { id } = data;

      if (!password || !confirmPassword || !id)
        throw createError.BadRequest("Not all fields have been entered");

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await Users.findOne({ idSocial: id });
      console.log(user);
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw createError.BadRequest("Password is incorrect");
        }

        const access_token = generateToken.createAccessToken({
          id: user._id,
        });
        const refresh_token = generateToken.createRefreshToken({
          id: user._id,
        });
        return res.status(200).json({
          success: true,
          message: "User is logged in",
          access_token,
          refresh_token,
          user,
        });
      } else {
        let profilePic = [
          {
            path: "https://i.postimg.cc/8cQHCF55/933-9332131-profile-picture-default-png.jpg",
          },
        ];
        if (req.files) {
          console.log(req.files);

          for (file of req.files) {
            profilePic.push({
              path: "https://kandle-api.com/" + file.path.toString(),
            });
          }
        }

        const newUser = new Users({
          email,
          password: passwordHash,
          phoneVerified: false,
          emailVerified: true,
          idSocial: id,
          name,
          birthDate,
          age,
          profilePic: profilePic,
        });
        const access_token = generateToken.createAccessToken({
          id: newUser._id,
        });
        const refresh_token = generateToken.createRefreshToken({
          id: newUser._id,
        });
        const user = await newUser.save();

        return res.status(200).json({
          success: true,
          message: "Registered Successfully ",
          access_token,
          refresh_token,
          user,
        });
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = SocialAuthCtr;
