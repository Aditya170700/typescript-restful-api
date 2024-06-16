import {ContactResponse, CreateContactRequest, toContactResponse, UpdateContactRequest} from "../model/contact-model";
import {Validation} from "../validation/validation";
import {ContactValidation} from "../validation/contact-validation";
import {Contact, User} from "@prisma/client";
import {prismaClient} from "../application/database";
import {ResponseError} from "../../error/response-error";

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
}
