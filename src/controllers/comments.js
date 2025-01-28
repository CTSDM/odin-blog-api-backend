import db from "../db/queries.js";
import validation from "../middleware/validation.js";

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

const remove = [
    validation.getComment,
    validation.checkErrors,
    async function (req, res) {
        const commentDeleted = await db.deleteComment(+req.body.id);
        if (commentDeleted) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    },
];

export default { add, remove };
