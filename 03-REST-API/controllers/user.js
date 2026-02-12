const User = require("../models/user")

async function handleGetAllUsers(req, res) {
    const alldBusers = await User.find({});
    return await res.json(alldBusers);
}

async function handleGetUserById(req, res) {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404)
    return res.json(user)
}

async function handleUpdateUserById(req, res) {
    await User.findByIdAndUpdate(req.params.id, { lastName: "Changed" })
    return res.json({ status: "Success" })
}

async function handleDeleteUserById(req, res) {
    await User.findByIdAndDelete(req.params.id)
    res.json({ status: "Success" })
}

async function handleCreateUser(req,res) {
    const body = req.body;
    if (!body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title) {
        return res.status(401).json({ error: "data incomplete" })
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title,
    })
    console.log(result);
    return res.status(201).json({ msg: "success", id: result.id});
}

module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateUser,
};