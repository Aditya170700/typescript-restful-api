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
exports.UserService = void 0;
const user_model_1 = require("../model/user-model");
const validation_1 = require("../validation/validation");
const user_validation_1 = require("../validation/user-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
class UserService {
    static register(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
            const isExists = (yield database_1.prismaClient.user.count({
                where: {
                    username: request.username,
                }
            })) > 0;
            if (isExists)
                throw new response_error_1.ResponseError(400, "Username already exists");
            data.password = yield bcrypt_1.default.hash(data.password, 10);
            const user = yield database_1.prismaClient.user.create({
                data: data
            });
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static login(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, request);
            let user = yield database_1.prismaClient.user.findUnique({
                where: {
                    username: request.username,
                }
            });
            if (!user)
                throw new response_error_1.ResponseError(401, "Incorrect username or password");
            const isPasswordValid = yield bcrypt_1.default.compare(data.password, user.password);
            if (!isPasswordValid)
                throw new response_error_1.ResponseError(401, "Incorrect username or password");
            user = yield database_1.prismaClient.user.update({
                where: {
                    username: request.username,
                },
                data: {
                    token: (0, uuid_1.v4)()
                }
            });
            const response = (0, user_model_1.toUserResponse)(user);
            response.token = user.token;
            return response;
        });
    }
    static get(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = validation_1.Validation.validate(user_validation_1.UserValidation.UPDATE, request);
            if (request.name) {
                user.name = request.name;
            }
            if (request.password) {
                user.password = yield bcrypt_1.default.hash(request.password, 10);
            }
            const result = yield database_1.prismaClient.user.update({
                where: {
                    username: user.username,
                },
                data: user
            });
            return (0, user_model_1.toUserResponse)(user);
        });
    }
    static logout(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.prismaClient.user.update({
                where: {
                    username: user.username,
                },
                data: {
                    token: null
                }
            });
            return (0, user_model_1.toUserResponse)(result);
        });
    }
}
exports.UserService = UserService;
