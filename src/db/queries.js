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

async function createPost(post, userId) {
    const newPost = await prisma.post.create({
        data: {
            title: post.title,
            content: post.content,
            visible: post.visible,
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
            visible: true,
            User: {
                select: {
                    username: true,
                },
            },
        },
    });
    return posts;
}

async function updatePost(id, post) {
    const newPost = await prisma.post.update({
        where: {
            id: id,
        },
        data: {
            // title: post.title,
            // content: post.content,
            visible: post.visible,
        },
    });

    return newPost;
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
            visible: true,
            User: {
                select: {
                    username: true,
                },
            },
            comments: {
                select: {
                    id: true,
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

async function createComment(content, userId, postId) {
    const newComment = await prisma.comment.create({
        data: {
            content: content,
            ["post_id"]: postId,
            ["user_id"]: userId,
        },
    });

    return newComment;
}

async function deleteComment(id) {
    const comment = await prisma.comment.delete({
        where: {
            id: id,
        },
    });

    return comment;
}

export default {
    getUser,
    createUser,
    createPost,
    getAllPosts,
    getPost,
    createComment,
    deleteComment,
    updatePost,
};

// define all the query functions
