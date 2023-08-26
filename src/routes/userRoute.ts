import express from "express";
import {
  signIn,
  signOut,
  signUp,
  verifyAndActivateUser,
} from "../controllers/userController";
const router = express.Router();

router.route("/signup").post(signUp);
router.route("/sign_in").post(signIn);
router.route("/logout").post(signOut);
router.route("/verify/:token").get(verifyAndActivateUser);

export default router;
