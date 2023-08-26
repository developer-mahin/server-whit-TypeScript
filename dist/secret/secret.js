"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseURl = void 0;
exports.databaseURl = process.env.DATABASE_URL || "mongodb://localhost:27017/ts";
