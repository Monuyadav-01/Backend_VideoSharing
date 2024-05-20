import { Router } from "express";
import {
  getCurrentUser,
  getUsers,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  userLogout,
} from "../controller/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/db").get(getUsers)
router.route("/login").post(loginUser);
// secured routes
router.route("/logout").post(verifyJWT, userLogout);
router.route("/refreshtoken").post(refreshAccessToken);
router.route("/login/updateuser").patch(verifyJWT, updateAccountDetails);
router.route("/login/currentuser").get(verifyJWT, getCurrentUser);
export default router;
