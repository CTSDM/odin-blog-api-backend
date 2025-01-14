import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUser(param, value) {
    const user = await prisma.user.findUnique({
        where: {
            [param]: value,
        },
    });

    return user;
}

async function createUser(user) {
    const newUser = await prisma.user.create({
        data: {
            username: user.username,
            password: user.pw,
            is_admin: user.admin,
        },
    });

    return newUser;
}

export default { getUser, createUser };

// define all the query functions
