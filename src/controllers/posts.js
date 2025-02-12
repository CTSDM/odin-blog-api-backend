import jwt from "../../config/jwt.js";
import db from "../db/queries.js";
import checks from "../middleware/checks.js";
import validation from "../middleware/validation.js";

async function getAll(_, res) {
    const posts = await db.getAllPosts();
    normalizeUserInDataArr(posts);
    return res.status(200).json(posts);
}

async function getVisiblePosts(_, res) {
    const posts = await db.getAllPosts();
    normalizeUserInDataArr(posts);
    const postsVisible = posts.filter((post) => post.visible === true);
    return res.status(200).json(postsVisible);
}

// this route is accessible by both users and admins
// if the post is visible both users and admins will get the post data
// if the post is not visible, only an authenticated admin can get the post
const get = [
    validation.getPost,
    validation.checkErrors,
    async function (req, res, next) {
        const post = await db.getPost(+req.params.id);
        if (post) {
            normalizeUserInDataArr(post.comments);
            post.username = post.User.username;
            req.payload = post;
            if (post.visible) {
                return res.status(200).json(req.payload);
            } else {
                next();
            }
        } else {
            return res.sendStatus(404);
        }
    },
];

const add = [
    validation.getPost,
    validation.dataPost,
    validation.checkErrors,
    async (req, res) => {
        const user = await db.getUser("username", req.user.username);
        const postData = {
            title: req.body.title,
            content: req.body.content,
            visible: req.body.visible,
        };
        const postCreated = await db.createPost(postData, user.id);
        return res.status(201).json({ msg: "APE POSTED", id: postCreated.id });
    },
];

const update = [
    validation.getPost,
    validation.dataPost,
    validation.checkErrors,
    async function (req, res) {
        const postId = +req.body.id;
        const post = await db.getPost(postId);
        if (post) {
            const data = {
                visible: !!req.body.visible,
                title: req.body.title,
                content: req.body.content,
            };
            const updatedPost = await db.updatePost(postId, data);
            if (updatedPost) {
                return res.status(200).json({ method: "put" });
            } else {
                return res.send(404).json({ message: "There is no post to update" });
            }
        } else {
            return res.sendStatus(404);
        }
    },
];

async function remove(req, res) {
    const postId = +req.params.id;
    const deletedPost = await db.deletePost(postId);
    if (deletedPost) {
        return res.status(200).json({ method: "delete" });
    } else {
        return res.sendStatus(404);
    }
}

function normalizeUserInDataArr(dataArr) {
    dataArr.forEach((data) => {
        data.username = data.User.username;
        delete data.User;
    });
}

export default { get, getAll, getVisiblePosts, add, update, remove };
