import { Router } from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
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

router.route("/login").post(loginUser);
// secured routes
router.route("/logout").post(verifyJWT, userLogout);
router.route('/refreshtoken').post(refreshAccessToken)
export default router;
