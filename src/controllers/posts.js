function getAll(_, res) {
    return res.json({ data: "data" });
}

function add(_, res) {
    return res.status(201).json({ msg: "APE POSTED" });
}

export default { getAll, add };
