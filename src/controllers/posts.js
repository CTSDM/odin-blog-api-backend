import db from "../db/queries.js";

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

async function get(req, res) {
    const post = await db.getPost(+req.params.id);
    const user = req.user;
    if (post && (post.visible === true || user["is_admin"])) {
        normalizeUserInDataArr(post.comments);
        post.username = post.User.username;
        delete post.User;
        return res.status(200).json(post);
    } else {
        return res.sendStatus(404);
    }
}

async function add(req, res) {
    // need to add validation
    // At this point it would be good to create your own template for validation
    // Also, you could add some tests...
    const user = await db.getUser("username", req.user.username);
    const postData = {
        title: req.body.title,
        content: req.body.content,
        visible: req.body.visible,
    };
    const postCreated = await db.createPost(postData, user.id);
    return res.status(201).json({ msg: "APE POSTED", id: postCreated.id });
}

async function update(req, res) {
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
}

async function remove(req, res) {
    const postId = +req.body.id;
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
