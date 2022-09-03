const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");
const { uploadImage } = require("../services/multer");
const { userSchema } = require("../DTO/update-User-schema");
router.get("/infor", auth, userCtrl.getUserInfor);
router.get("/all", userCtrl.getAllUsers);
router.put(
  "/update-profile/:id",
  userSchema,
  userCtrl.updateProfile
);
router.post("/change-password", auth, userCtrl.changePassword);
router.delete("/delete-account/:id", userCtrl.deleteAccount);

//router.post("activate-email", auth, userCtrl.activateEmail);
module.exports = router;
