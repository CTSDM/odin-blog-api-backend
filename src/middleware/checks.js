function isAdmin(req, res, next) {
    if (req.user["is_admin"]) {
        next();
    } else {
        return res.sendStatus(401);
    }
}

export default { isAdmin };
