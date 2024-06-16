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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const contact_model_1 = require("../model/contact-model");
const validation_1 = require("../validation/validation");
const contact_validation_1 = require("../validation/contact-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class ContactService {
    static create(user, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = validation_1.Validation.validate(contact_validation_1.ContactValidation.CREATE, req);
            const record = Object.assign(Object.assign({}, data), { username: user.username });
            const contact = yield database_1.prismaClient.contact.create({
                data: record,
            });
            return (0, contact_model_1.toContactResponse)(contact);
        });
    }
    static checkContactMustExists(username, contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield database_1.prismaClient.contact.findUnique({
                where: {
                    id: contactId,
                    username: username,
                }
            });
            if (!data)
                throw new response_error_1.ResponseError(404, "Could not find contact");
            return data;
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.checkContactMustExists(user.username, id);
            return (0, contact_model_1.toContactResponse)(data);
        });
    }
    static update(user, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = validation_1.Validation.validate(contact_validation_1.ContactValidation.UPDATE, req);
            yield this.checkContactMustExists(user.username, data.id);
            const contact = yield database_1.prismaClient.contact.update({
                where: {
                    id: data.id,
                    username: user.username,
                },
                data: data,
            });
            return (0, contact_model_1.toContactResponse)(contact);
        });
    }
    static remove(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkContactMustExists(user.username, id);
            const contact = yield database_1.prismaClient.contact.delete({
                where: {
                    id: id,
                    username: user.username,
                }
            });
            return (0, contact_model_1.toContactResponse)(contact);
        });
    }
    static search(user, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = validation_1.Validation.validate(contact_validation_1.ContactValidation.SEARCH, req);
            const skip = (data.page - 1) * data.size;
            const filters = [];
            if (data.name) {
                filters.push({
                    OR: [
                        {
                            first_name: {
                                contains: data.name,
                            }
                        },
                        {
                            last_name: {
                                contains: data.name,
                            }
                        }
                    ]
                });
            }
            if (data.email) {
                filters.push({
                    email: {
                        contains: data.email,
                    }
                });
            }
            if (data.phone) {
                filters.push({
                    phone: {
                        contains: data.phone,
                    }
                });
            }
            const contacts = yield database_1.prismaClient.contact.findMany({
                where: {
                    username: user.username,
                    AND: filters
                },
                take: data.size,
                skip: skip
            });
            const total = yield database_1.prismaClient.contact.count({
                where: {
                    username: user.username,
                    AND: filters
                }
            });
            return {
                data: contacts.map(contact => (0, contact_model_1.toContactResponse)(contact)),
                paging: {
                    current_page: data.page,
                    total_page: Math.ceil(total / data.size),
                    size: data.size
                }
            };
        });
    }
}
exports.ContactService = ContactService;
