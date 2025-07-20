"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = exports.CreateRoomSchema = exports.SigninSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(20),
    password: zod_1.z.string(),
    name: zod_1.z.string(),
});
exports.SigninSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(20),
    password: zod_1.z.string(),
});
exports.CreateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(20),
});
exports.JWT_SECRET = process.env.JWT_SECRET || "secret";
