import db from "../db/queries.js";
import validation from "../middleware/validation.js";

function add(req, res) {
    const content = req.body.content;
    const userId = req.user.id;
    const postId = +req.body.postId;
    try {
        const comment = db.createComment(content, userId, postId);
        if (comment) {
            res.sendStatus(200);
        } else {
            res.sendStatus(500);
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

const remove = [
    validation.getComment,
    validation.checkErrors,
    async function (req, res) {
        const commentId = +req.body.id;
        const user = await db.getUser("username", req.user.username);
        const comment = await db.getComment(commentId);
        if (comment) {
            if (user.is_admin || user.id === comment.user_id) {
                await db.deleteComment(commentId);
                return res.sendStatus(200);
            } else {
                return res.sendStatus(401);
            }
        } else {
            return res.sendStatus(404);
        }
    },
];

export default { add, remove };
