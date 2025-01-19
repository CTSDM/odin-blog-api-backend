import db from "../db/queries.js";

async function getAll(_, res) {
    const posts = await db.getAllPosts();
    posts.forEach((post) => {
        post.username = post.User.username;
        delete post.User;
    });
    res.status(200).json(posts);
}

async function get(req, res) {
    const post = await db.getPost(+req.params.id);
    if (post) {
        post.comments.forEach((comment) => {
            comment.username = comment.User.username;
        });
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
    const postData = { title: req.body.title, content: req.body.content };
    const postCreated = await db.createPost(postData, user.id);
    return res.status(201).json({ msg: "APE POSTED", id: postCreated.id });
}

export default { get, getAll, add };
