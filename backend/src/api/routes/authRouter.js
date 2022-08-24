const router = require("express").Router();
const authCtrl = require("../controllers/authCtrl");
const SocialAuthCtr = require("../controllers/SocialAuthCtrl");
const auth = require("../middleware/auth");
const verifyToken = require("../middleware/verification");
const { uploadImage } = require("../services/multer");
router.post("/register", authCtrl.register);
router.post("/send-otp", authCtrl.sendOTP);
router.post("/verify-otp", auth, authCtrl.verifyOTP);
router.post("/login", authCtrl.login);
// router.post("/send-2FA", auth, authCtrl.twoFactorAuthSendOTP);
// router.post("/verify-2FA", auth, authCtrl.twoFactorAuthVerifyOTP);
// router.post("/forgot-password-email", authCtrl.forgotPasswordEmail);
// router.post("/reset-password-email", authCtrl.resetPasswordEmail);
// router.post("/forgot-password-phone", authCtrl.forgotPasswordPhone);
// router.post("/verify-reset-otp", authCtrl.verifyOTPresetPhone);
// router.post("/reset-password-phone", authCtrl.resetPasswordPhone);
// router.post("/google-signup", SocialAuthCtr.googleSignup);
// router.post("/google-login", SocialAuthCtr.googleLogin);
// router.post("/facebook-signup", SocialAuthCtr.facebookSignup);
// router.post("/facebook-login", SocialAuthCtr.facebookLogin);

// router.post("/social-register", SocialAuthCtr.registerSocialFront);
router.post(
  "/facebook-register",
  uploadImage.array("profilePic"),
  SocialAuthCtr.registerFacebook,
  (error, req, res, next) => {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
);

router.post("/logout", auth, authCtrl.logout);
router.get("/refresh_token", authCtrl.generateAccessToken);
// router.get("/:id/verifyEmail/:token/", verifyToken, authCtrl.verifyEmail);
module.exports = router;
