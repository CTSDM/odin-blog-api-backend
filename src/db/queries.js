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
            username_lowercase: user.username.toLowerCase(),
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
        orderBy: {
            id: "desc",
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
            title: post.title,
            content: post.content,
            visible: post.visible,
        },
    });

    return newPost;
}

async function getLikesCount(postId) {
    const likeCount = await prisma.like.count({
        where: {
            post_id: postId,
        },
    });
    return likeCount;
}

async function createLike(userId, postId) {
    const like = await prisma.like.create({
        data: {
            user_id: userId,
            post_id: postId,
        },
    });
    return like;
}

async function deleteLike(userId, postId) {
    const like = await prisma.like.deleteMany({
        where: {
            user_id: userId,
            post_id: postId,
        },
    });
    return like;
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
            likes: {
                select: {
                    User: {
                        select: {
                            username: true,
                        },
                    },
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
                orderBy: {
                    created_time: "asc",
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

async function deletePost(id) {
    const post = await prisma.post.delete({
        where: {
            id: id,
        },
    });

    return post;
}

async function createToken(tokenString, userId) {
    const token = await prisma.token.create({ data: { id: tokenString, user_id: userId } });
    return token;
}

async function getToken(tokenString) {
    const token = await prisma.token.findUnique({
        where: {
            id: tokenString,
        },
    });
    return token;
}

async function getComment(id) {
    const comment = await prisma.comment.findUnique({
        where: {
            id: id,
        },
    });

    return comment;
}

async function deleteToken(tokenString) {
    const token = await prisma.token.delete({ where: { id: tokenString } });
    return token;
}

export default {
    getUser,
    getComment,
    getLikesCount,
    createLike,
    createUser,
    createPost,
    createToken,
    getAllPosts,
    getPost,
    getToken,
    createComment,
    deleteComment,
    updatePost,
    deletePost,
    deleteToken,
    deleteLike,
};
