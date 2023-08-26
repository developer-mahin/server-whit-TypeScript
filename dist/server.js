"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
mongoose_1.default
    .connect("mongodb://127.0.0.1:27017/ts")
    .then(() => {
    console.log(colors_1.default.blue.bold("database connect successful"));
})
    .catch((err) => {
    console.log(err.message);
});
app_1.default.listen(port, () => {
    console.log(colors_1.default.white.bold(`Serer running on the port http://localhost:${port}`));
});
