"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, "Fist Name is required"],
        trim: true,
        minlength: [3, "Name can't be less than 3 character"],
        maxLength: [31, "Name can't be less than 3 character"],
        lowercase: true,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
        minlength: [3, "Name can't be less than 3 character"],
        maxLength: [31, "Name can't be less than 3 character"],
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validator: [validator_1.default.isEmail, "Please provide a valid email address"],
    },
    phone: {
        type: String,
        trim: true,
        validator: [
            validator_1.default.isMobilePhone,
            "Please provide a valid phone number",
        ],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        trim: true,
        validator: (value) => validator_1.default.isStrongPassword(value, {
            minLength: 6,
        }),
    },
    confirmPassword: {
        type: String,
        required: [true, "Confirm Password is required"],
        trim: true,
        validator: {
            function(value) {
                return (value = this.password);
            },
            message: "Password doesn't match please try again with valid password",
        },
    },
    image: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "blocked", "de-active", "ban"],
        default: "active",
    },
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    const password = this.password;
    const hashedPassword = bcryptjs_1.default.hashSync(password, bcryptjs_1.default.genSaltSync(10));
    this.password = hashedPassword;
    this.confirmPassword = undefined;
    next();
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
