import {AddressTest, ContactTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able to create address', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "test",
                city: "test",
                province: "test",
                country: "test",
                postal_code: "test",
            });

        logger.debug(response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe("test");
        expect(response.body.data.city).toBe("test");
        expect(response.body.data.province).toBe("test");
        expect(response.body.data.country).toBe("test");
        expect(response.body.data.postal_code).toBe("test");
    });

    it('Should be reject to create address if request is invalid', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "test",
                city: "test",
                province: "test",
                country: "",
                postal_code: "",
            });

        logger.debug(response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Should be reject to create address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id + 1}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "test",
                city: "test",
                province: "test",
                country: "test",
                postal_code: "test",
            });

        logger.debug(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able to get address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe(address.street);
        expect(response.body.data.city).toBe(address.city);
        expect(response.body.data.province).toBe(address.province);
        expect(response.body.data.country).toBe(address.country);
        expect(response.body.data.postal_code).toBe(address.postal_code);
    });

    it('Should be reject to get address if id not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it('Should be reject to get address if contact id not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able to update address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "update",
                city: "update",
                province: "update",
                country: "update",
                postal_code: "update",
            });

        logger.debug(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe("update");
        expect(response.body.data.city).toBe("update");
        expect(response.body.data.province).toBe("update");
        expect(response.body.data.country).toBe("update");
        expect(response.body.data.postal_code).toBe("update");
    });

    it('Should reject update address if data is invalid', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "update",
                city: "update",
                province: "update",
                country: "",
                postal_code: "",
            });

        logger.debug(response.body);
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Should reject update address if address is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "update",
                city: "update",
                province: "update",
                country: "update",
                postal_code: "update",
            });

        logger.debug(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it('Should reject update address if contact is not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "update",
                city: "update",
                province: "update",
                country: "update",
                postal_code: "update",
            });

        logger.debug(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able to remove address', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toBe(true);
    });

    it('Should be reject to remove address if id not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it('Should be reject to get remove if contact id not found', async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();

        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });

    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able to get list address', async () => {
        const contact = await ContactTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    it('Should be reject get list address if contact not found', async () => {
        const contact = await ContactTest.get();

        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});
