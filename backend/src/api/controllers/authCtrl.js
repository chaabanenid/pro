const Users = require("../models/userModel");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../services/TokenGenerate");

// const userOTP = require("twilio")(
//   process.env.ACCOUNT_SID,
//   process.env.AUTH_TOKEN
// );
const auth = require("../middleware/auth");
const createError = require("http-errors");

const { sendEmail } = require("../services");

const authCtrl = {
  register: async (req, res, next) => {
    try {
      const { email, password, confirmPassword } = req.body;
      if (!email || !password)
        return res.status(403).json({
          success: false,
          message: "Not all fields have been entered",
        });

      if (!validateEmail(email))
        return res.status(401).json({
          success: false,
          message: "Invalid email.",
        });
      const user_email = await Users.findOne({ email });
      if (user_email) {
        return res.status(400).json({
          success: false,
          message: "This email is already registered",
        });
      }
      if (password.length < 6) {
        return res.status(402).json({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = new Users(req.body);
      const access_token = generateToken.createAccessToken({ id: newUser._id });
      const refresh_token = generateToken.createRefreshToken({
        id: newUser._id,
      });
      const user = await newUser.save();

      const url = `${process.env.CLIENT_URL}api/auth/${user._id}/verifyEmail/${access_token}`;

      await sendEmail(user.email, "Verify Email", url, next);

      return res.status(201).json({
        success: true,
        message: "Registered Successfully and an email sent to your account!",
        access_token,
        refresh_token,
        user: {
          ...newUser._doc,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  /**************************** OTP ********************************/
  sendOTP: async (req, res) => {
    try {
      const phoneNumber = req.body.phoneNumber;
      const user_phone = await Users.findOne({ phoneNumber });
      if (user_phone) {
        return res.status(400).json({
          success: false,
          message: "This phone is already registered",
        });
      }
      if (phoneNumber) {
        userOTP.verify
          .services(process.env.SERVICE_ID)
          .verifications.create({
            to: `+${phoneNumber}`,
            channel: "sms",
          })
          .then((data) => {
            res.status(200).json({
              success: true,
              message: "Verification is sent !",
              phoneNumber,
              data,
            });
          });
      } else {
        res.status(405).json({
          success: false,
          message: "Wrong phone number !",
          phoneNumber,
          data,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      const code = req.body.code;
      const phoneNumber = req.query.phoneNumber;

      if (phoneNumber && code.length === 6) {
        userOTP.verify
          .services(process.env.SERVICE_ID)
          .verificationChecks.create({
            to: `+${phoneNumber}`,
            code,
          })
          .then(async (data) => {
            if (data.valid === false) {
              console.log("OTP is incorrect !");
              return res.status(401).json({
                success: false,
                message: "OTP is incorrect!",
              });
            }
            const verifiedPhone = req.query.phoneNumber;
            if (data.status === "approved" && verifiedPhone) {
              await Users.findOneAndUpdate(
                { _id: req.user._id },
                { phoneNumber: verifiedPhone }
              );
              console.log(req.user._id);
              const refresh_token = generateToken.createRefreshToken({
                id: req.user._id,
              });
              res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/api/auth/refresh_token",
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
              });

              req.user.phoneNumber = verifiedPhone;
              req.user.phoneVerified = true;
              req.user.online = true;
              req.user.save();
              console.log("user after update", req.user);
              console.log("new phone added", verifiedPhone);
              res.status(200).json({
                success: true,
                message:
                  "User is Verified, phone number is added and logged in",
                data,
                refresh_token,
                user: {
                  ...req.user._doc,
                },
              });
            }
          })
          .catch((err) => {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          });
      } else {
        return res.status(405).json({
          success: false,
          message: "Wrong phone number or code !",
          phoneNumber,
          data,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  /**************************** OTP ********************************/
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!validateEmail(email))
        return res.status(400).json({
          success: false,
          message: "Invalid email",
        });
      const user = await Users.findOne({ email }).populate(
        "-password",
        "-phoneVerified"
      );
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not registred",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(402).json({
          success: false,
          message: "Password is incorrect",
        });
      }
      const access_token = generateToken.createAccessToken({ id: user._id });
      const refresh_token = generateToken.createRefreshToken({ id: user._id });

      return res.status(200).json({
        success: true,
        message: "Auth valid, 2FA not verified",
        access_token,
        user,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  twoFactorAuthSendOTP: async (req, res) => {
    try {
      const phoneNumber = req.query.phoneNumber;
      const user_phone = await Users.findOne({ phoneNumber });
      console.log("connecting to", phoneNumber);
      if (user_phone) {
        userOTP.verify
          .services(process.env.SERVICE_ID)
          .verifications.create({
            to: `+${phoneNumber}`,
            channel: "sms",
          })
          .then((data) => {
            res.status(200).json({
              success: true,
              message: "Verification is sent !",
              phoneNumber,
              data,
            });
          });
      } else {
        res.status(405).json({
          success: false,
          message: "Wrong phone number !",
          phoneNumber,
          data,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  // twoFactorAuthVerifyOTP: async (req, res) => {
  //   try {
  //     const code = req.body.code;
  //     const phoneNumber = req.query.phoneNumber;
  //     const user = await Users.findOne({ phoneNumber });
  //     if (phoneNumber && code.length === 6) {
  //       userOTP.verify
  //         .services(process.env.SERVICE_ID)
  //         .verificationChecks.create({
  //           to: `+${phoneNumber}`,
  //           code,
  //         })
  //         .then(async (data) => {
  //           if (data.valid === false) {
  //             console.log("OTP is incorrect !");
  //             return res.status(401).json({
  //               success: false,
  //               message: "OTP is incorrect!",
  //             });
  //           }
  //           if (data.status === "approved") {
  //             const access_token = generateToken.createAccessToken({
  //               id: req.user._id,
  //             });
  //             const refresh_token = generateToken.createRefreshToken({
  //               id: user._id,
  //             });
  //             res.cookie("refreshtoken", refresh_token, {
  //               httpOnly: true,
  //               path: "/api/auth/refresh_token",
  //               sameSite: "lax",
  //               maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  //             });
  //             req.user.online = true;
  //             req.user.save();
  //             res.status(200).json({
  //               success: true,
  //               message: "User is Verified and Logged in Successfully",
  //               data,
  //               access_token,
  //               refresh_token,
  //               user: {
  //                 ...req.user._doc,
  //               },
  //             });
  //           }
  //         })
  //         .catch((err) => {
  //           return res.status(500).json({
  //             success: false,
  //             message: "Internal Twilio Server Error",
  //           });
  //         });
  //     } else {
  //       return res.status(405).json({
  //         success: false,
  //         message: "Wrong code !",
  //         phoneNumber,
  //         data,
  //       });
  //     }
  //   } catch (err) {
  //     return res.status(500).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // },

  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) {
        return res.status(402).json({
          success: false,
          message: "Login again.",
        });
      }
      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) {
            return res.status(403).json({
              success: false,
              message: "Login again.",
            });
          }
          const user = await Users.findById(result.id).select("-password");
          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User does not exist !",
            });
          }
          return res.status(200).json({
            success: true,
            message: "User is:",
            user,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const user = await Users.findOne({ _id: req.user._id });
      if ((user.online = false)) {
        return res.status(400).json({
          success: false,
          message: "Already logged out",
          user,
        });
      } else {
        res.clearCookie("refreshtoken", { path: "/api/auth/refresh_token" });
        user.online = false;
        user.save();
        console.log("logged out successfully", user);
        return res.status(200).json({
          success: true,
          message: "Logged out Successfully.",
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

  forgotPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email)
        return res.status(400).json({
          success: false,
          message: "No Email in request",
        });
      console.log("Forgot password finding user with given email", email);
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User with given email doesn't exist",
        });
      } else {
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
          token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
        }
        res.status(200).json({
          success: true,
          message: "User exists and token is:",
          token,
        });
        //console.log('Token is: ', token, "\n", 'User is: ', user);
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  resetPasswordEmail: async (req, res, next) => {
    try {
      const email = req.query.email;
      const { newPassword } = req.body;
      const user = await Users.findOne({ email });
      const token = await Token.findOne({
        userId: user._id,
        token: req.query.token,
      });
      if (!token)
        return res.status(401).json({
          success: false,
          message: "Invalid token or expired",
        });
      const passwordHash = await bcrypt.hash(newPassword, 12);
      user.password = passwordHash;
      await user.save();
      await token.delete();
      return res.status(200).json({
        success: true,
        message: "You can login with your new password !",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
  forgotPasswordPhone: async (req, res, next) => {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "No phone number in request",
        });
      }
      const user = await Users.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User with that phone number does not exist!",
        });
      }
      if (user.idSocial) {
        throw createError[401](
          "You can't change your password with social media"
        );
      }

      if (phoneNumber) {
        console.log("forgot password finding user with that phone number");
        console.log("connecting to ", phoneNumber);
        userOTP.verify
          .services(process.env.SERVICE_ID)
          .verifications.create({
            to: `+${phoneNumber}`,
            channel: "sms",
          })
          .then((data) => {
            res.status(200).json({
              success: true,
              message: "Reset password OTP is sent !",
              phoneNumber,
              data,
            });
            console.log("Reset password OTP is sent !");
          });
      }
    } catch (error) {
      next(error);
    }
  },
  // verifyOTPresetPhone: async (req, res) => {
  //   try {
  //     const phoneNumber = req.query.phoneNumber;
  //     const { code } = req.body;
  //     const user = await Users.findOne({ phoneNumber });
  //     let token = await Token.findOne({ userId: user._id });
  //     if (!token) {
  //       token = await new Token({
  //         userId: user._id,
  //         token: crypto.randomBytes(32).toString("hex"),
  //       }).save();
  //     }
  //     if (phoneNumber && code.length === 6) {
  //       userOTP.verify
  //         .services(process.env.SERVICE_ID)
  //         .verificationChecks.create({
  //           to: `+${phoneNumber}`,
  //           code,
  //         })
  //         .then((data) => {
  //           if (data.valid === false) {
  //             -+console.log("OTP is incorrect !");
  //             return res.status(401).json({
  //               success: true,
  //               message: "OTP is incorrect!",
  //             });
  //           }
  //           if (data.status === "approved") {
  //             console.log("OTP is Verified ! Token is", token);
  //             return res.status(200).json({
  //               success: true,
  //               message: "OTP is Verified !",
  //               data,
  //               token,
  //             });
  //           }
  //         })
  //         .catch((err) => {
  //           return res.status(500).json({
  //             success: false,
  //             message: "Internal Twilio Server Error",
  //           });
  //         });
  //     } else {
  //       res.status(405).json({
  //         success: false,
  //         message: "Wrong phone number or code !",
  //         phoneNumber,
  //       });
  //     }
  //   } catch (err) {
  //     return res.status(500).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // },
  // resetPasswordPhone: async (req, res) => {
  //   try {
  //     const { newPassword } = req.body;
  //     const user = await Users.findById(req.query.userId);
  //     const passwordHash = await bcrypt.hash(newPassword, 12);
  //     if (!user)
  //       return res.status(400).json({
  //         success: true,
  //         message: "Invalid user",
  //       });
  //     const token = await Token.findOne({
  //       userId: user._id,
  //       token: req.query.token,
  //     });
  //     if (!token)
  //       return res.status(401).json({
  //         success: false,
  //         message: "Invalid token or expired !",
  //         token,
  //       });
  //     user.password = passwordHash;

  //     // it's not working
  //     user.save();

  //     await token.delete();
  //     return res.status(200).json({
  //       success: true,
  //       message: "You can login with your new password !",
  //     });
  //   } catch (err) {
  //     return res.status(500).json({
  //       success: false,
  //       message: err.message,
  //     });
  //   }
  // },
  /**************************** VERIFY EMAIL ********************************/

  //   verifyEmail: async (req, res, next) => {
  //     try {
  //       const user = await Users.findOne({ _id: req.params.id });
  //       if (!user) throw createError.BadRequest("Invalid link");
  //       // const token = await Token.findOne({
  //       //   userId: user._id,
  //       //   token: req.params.token,
  //       // });

  //       // if (!token) throw createError.BadRequest("Invalid link");

  //       await Users.updateOne({ _id: user._id }, { emailVerified: true });
  //       // await token.remove();

  //       return res
  //         .writeHead(301, {
  //           Location: `http://kandle`,
  //         })
  //         .end();
  //     } catch (error) {
  //       next(error);
  //     }
  //   },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = authCtrl;
