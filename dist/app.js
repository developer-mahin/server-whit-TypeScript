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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const http_errors_1 = __importDefault(require("http-errors"));
const colors_1 = __importDefault(require("colors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const app = (0, express_1.default)();
const limit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: "To many request at a time, Please try again later",
});
app.use(limit);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use("/api/v1/auth", userRoute_1.default);
app.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(colors_1.default.blue.bold("First TypeScript server is running"));
    res.status(200).json({
        message: "welcome to the server",
    });
}));
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404, "Route Not found"));
});
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    });
});
exports.default = app;
