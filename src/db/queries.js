import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    log: ["query"],
});

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

async function createPost(post, userId) {
    const newPost = await prisma.post.create({
        data: {
            title: post.title,
            content: post.content,
            user_id: userId,
        },
    });

    return newPost;
}

async function getAllPosts() {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            ["created_time"]: true,
            title: true,
            content: true,
            User: {
                select: {
                    username: true,
                },
            },
        },
    });
    return posts;
}

async function getPost(id) {
    const post = await prisma.post.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            ["created_time"]: true,
            title: true,
            content: true,
            User: {
                select: {
                    username: true,
                },
            },
            comments: {
                select: {
                    ["created_time"]: true,
                    content: true,
                    User: {
                        select: {
                            username: true,
                        },
                    },
                },
            },
        },
    });

    return post;
}

export default { getUser, createUser, createPost, getAllPosts, getPost };

// define all the query functions
