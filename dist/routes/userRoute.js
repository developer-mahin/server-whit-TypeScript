"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.route("/signup").post(userController_1.signUp);
router.route("/sign_in").post(userController_1.signIn);
router.route("/logout").post(userController_1.signOut);
router.route("/verify/:token").get(userController_1.verifyAndActivateUser);
exports.default = router;
