import db from "../db/queries.js";

function add(req, res) {
    const content = req.body.content;
    const userId = req.user.id;
    const postId = +req.body.postId;
    const comment = db.createComment(content, userId, postId);
    if (comment) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
}

async function remove(req, res) {
    const postDeleted = await db.deleteComment(req.body.id);
    if (postDeleted) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}

export default { add, remove };
