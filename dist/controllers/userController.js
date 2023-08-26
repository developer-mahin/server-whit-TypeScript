"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signOut = exports.signIn = exports.verifyAndActivateUser = exports.signUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_errors_1 = __importDefault(require("http-errors"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("../utils/jsonwebtoken"));
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.SECRET_KEY || "secret_key";
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, confirmPassword, role, status, phone, image, } = req.body;
        const isExist = yield user_1.default.exists({ email });
        if (isExist) {
            throw new Error("User already exists with this email address. Please try again with another email address.");
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(10));
        const query = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            role: "user",
            status: "active",
        };
        const token = yield (0, jsonwebtoken_1.default)(query, secretKey, "10m");
        try {
            const mailData = {
                email: email,
                subject: "Account Activation Email",
                html: `
                <h2>Hello ${firstName} ${" "} ${lastName} !</h2>
                <p>Please activate your account to click here </p>
                <a
                style="padding:10px 20px; color:green; background:cyan; border-radius:5px;text-decoration:none"
                href="${process.env.SERVER_URL}api/v1/auth/verify/${token}"
                target="_blank"
                >
                Click here to activate
                </a>
                `,
            };
            yield (0, sendEmail_1.default)(mailData);
        }
        catch (error) {
            next(error);
            return;
        }
        res.json({
            success: true,
            message: "Please go to your email and complete the verification process.",
            token,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const verifyAndActivateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        console.log(token);
        if (!token) {
            throw (0, http_errors_1.default)(404, "Token not found");
        }
        try {
            const decoded = jsonwebtoken_2.default.verify(token, secretKey);
            if (!decoded) {
                throw (0, http_errors_1.default)(401, "unauthorized access");
            }
            const isExist = yield user_1.default.exists({ email: decoded.email });
            if (isExist) {
                throw (0, http_errors_1.default)(400, "User already exist with this email");
            }
            const user = yield user_1.default.create(decoded);
            res.send(`

            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body
                style="background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6)), url(https://i.ibb.co/wYYTcPF/JOB-HUNTER-removebg-preview.png); 
                background-position: center; background-repeat: no-repeat; background-size: contain;  display: flex; align-items:  center; justify-content: center; height: 98vh; color: white;">
                <div>
                    <h1 style="text-align:center ; font-size: 70px; margin: 0;">Hello ${decoded.firstName + " " + decoded.lastName}</h1>
                    <p style="text-align:center ;font-size: 50px; margin: 0;">You are now a verified user</p>
                    <p style="text-align:center ;font-size: 40px; margin: 0;">Please login your with your account</p>
                    <div style="display: flex; align-items: center; justify-content: center; margin-top: 20px;">
                        <a href="http://localhost:3000/login"
                            style="padding: 12px 20px; background-color: aqua; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 30px;">Login</a>
                    </div>
                </div>
            </body>
            </html>
            `);
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                throw (0, http_errors_1.default)(401, "Token expired");
            }
            if (error.name === "JsonWebTokenError") {
                throw (0, http_errors_1.default)(401, "Invalid token");
            }
            else {
                throw error;
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.verifyAndActivateUser = verifyAndActivateUser;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.default.findOne({ email });
        if (!user) {
            throw (0, http_errors_1.default)(404, "User not found with this email address please try with another email address");
        }
        const isMatchedPassword = bcryptjs_1.default.compare(password, user.password);
        if (!isMatchedPassword) {
            throw (0, http_errors_1.default)(400, "email/password not match please try again with valid information or create account");
        }
        if (user.status !== "active") {
            throw (0, http_errors_1.default)(400, "You are not active user please contact with authority");
        }
        const userData = {
            email,
            userId: user._id,
        };
        const token = yield (0, jsonwebtoken_1.default)(userData, secretKey, "10days");
        res.cookie("access_token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            message: "user login successfully",
            user,
            token,
        });
        res.status(200).json({});
    }
    catch (error) {
        next(error);
    }
});
exports.signIn = signIn;
const signOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("access_token");
        res.status(200).json({
            success: true,
            message: "user logout successful",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signOut = signOut;
