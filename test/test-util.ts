import {prismaClient} from "../src/application/database";

export class UserTest {
    static async delete() {
        const where = {
            username: "test"
        };

        await prismaClient.user.deleteMany({where});
    }
}
