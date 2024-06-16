import {Address, User} from "@prisma/client";
import {
    AddressResponse,
    CreateAddressRequest,
    GetAddressRequest,
    toAddressResponse,
    UpdateAddressRequest
} from "../model/address-model";
import {Validation} from "../validation/validation";
import {AddressValidation} from "../validation/address-validation";
import {ContactService} from "./contact-service";
import {prismaClient} from "../application/database";
import {ResponseError} from "../../error/response-error";

export class AddressService {
    static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        const data = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);

        const address = await prismaClient.address.create({
            data: data
        });

        return toAddressResponse(address as Address);
    }

    static async checkAddressMustExists(contactId: number, addressId: number): Promise<Address> {
        const address = await prismaClient.address.findFirst({
            where: {
                id: addressId,
                contact_id: contactId,
            }
        });

        if (!address) throw new ResponseError(404, "Address not found");

        return address as Address;
    }

    static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
        const data = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);
        const address = await this.checkAddressMustExists(data.contact_id, data.id);

        return toAddressResponse(address as Address);
    }

    static async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
        const data = Validation.validate(AddressValidation.UPDATE, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);
        await this.checkAddressMustExists(data.contact_id, data.id);

        const address = await prismaClient.address.update({
            where: {
                id: data.id,
                contact_id: data.contact_id,
            },
            data: data
        });

        return toAddressResponse(address as Address);
    }
}