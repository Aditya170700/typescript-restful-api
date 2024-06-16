import {
    ContactResponse,
    CreateContactRequest,
    SearchContactRequest,
    toContactResponse,
    UpdateContactRequest
} from "../model/contact-model";
import {Validation} from "../validation/validation";
import {ContactValidation} from "../validation/contact-validation";
import {Contact, User} from "@prisma/client";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Pageable} from "../model/page";
import {logger} from "../application/logging";

export class ContactService {
    static async create(user: User, req: CreateContactRequest): Promise<ContactResponse> {
        const data = Validation.validate(ContactValidation.CREATE, req);
        const record = {
            ...data,
            ...{username: user.username},
        }

        const contact = await prismaClient.contact.create({
            data: record,
        });

        return toContactResponse(contact as Contact);
    }

    static async checkContactMustExists(username: string, contactId: number): Promise<Contact> {
        const data = await prismaClient.contact.findUnique({
            where: {
                id: contactId,
                username: username,
            }
        });

        if (!data) throw new ResponseError(404, "Could not find contact");

        return data as Contact;
    }

    static async get(user: User, id: number): Promise<ContactResponse> {
        const data = await this.checkContactMustExists(user.username, id);
        return toContactResponse(data as Contact);
    }

    static async update(user: User, req: UpdateContactRequest): Promise<ContactResponse> {
        const data = Validation.validate(ContactValidation.UPDATE, req);
        await this.checkContactMustExists(user.username, data.id);

        const contact = await prismaClient.contact.update({
            where: {
                id: data.id,
                username: user.username,
            },
            data: data,
        });

        return toContactResponse(contact as Contact);
    }

    static async remove(user: User, id: number): Promise<ContactResponse> {
        await this.checkContactMustExists(user.username, id);

        const contact = await prismaClient.contact.delete({
            where: {
                id: id,
                username: user.username,
            }
        });

        return toContactResponse(contact as Contact);
    }

    static async search(user: User, req: SearchContactRequest): Promise<Pageable<ContactResponse>> {
        const data = Validation.validate(ContactValidation.SEARCH, req);
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

        const contacts = await prismaClient.contact.findMany({
            where: {
                username: user.username,
                AND: filters
            },
            take: data.size,
            skip: skip
        });

        const total = await prismaClient.contact.count({
            where: {
                username: user.username,
                AND: filters
            }
        });

        return {
            data: contacts.map(contact => toContactResponse(contact)),
            paging: {
                current_page: data.page,
                total_page: Math.ceil(total / data.size),
                size: data.size
            }
        };
    }
}
