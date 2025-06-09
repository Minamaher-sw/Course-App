
import bcrypt from 'bcryptjs';
import  jwt from 'jsonwebtoken';
import asyncWrapper from "../middleware/asyncWrapper.js";
import httpStatusMessage from "../utils/httpStatusJsend.js";
import appErrors from "../utils/appError.js";
import StatusCodes from "../utils/statusCodes.js";
import { getCollection } from "../data/db.connection.js";
import { validationResult } from "express-validator";
const signup=asyncWrapper(async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userCollection = await getCollection("users");
    const { password, ...rest } = req.body;
    if (!password) {
        const error = appErrors.createError("Password is required", StatusCodes.BAD_REQUEST, httpStatusMessage.FAIL);
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body = { ...rest, password: hashedPassword };
    const createdUser = await userCollection.insertOne(req.body);

    res.status(StatusCodes.CREATED).json({
        status: httpStatusMessage.SUCCESS,
        data: createdUser
    });
})
const userLogin = asyncWrapper(async (req, res) => {
    const userCollection = await getCollection("users");
    const { username, password } = req.body;

    const user = await userCollection.findOne({ username });
    if (!user) {
        const error = appErrors.createError("Invalid username or password", StatusCodes.UNAUTHORIZED, httpStatusMessage.FAIL);
        throw error;
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        const error = appErrors.createError("Invalid username or password", StatusCodes.UNAUTHORIZED, httpStatusMessage.FAIL);
        throw error;
    }
    const token = jwt.sign(
        {
            username: user.username,
            id: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    res.status(StatusCodes.OK).json({
        message: "Login successful",
        token
    });
});

const getAllUser = asyncWrapper(async (req, res) => {
    const userCollection = await getCollection("users");
    const allUsers = await userCollection.find().toArray();
    res.status(StatusCodes.OK).json({
        status: httpStatusMessage.SUCCESS,
        data: allUsers
    });
});

const getUserById = asyncWrapper(async (req, res) => {
    const userCollection = await getCollection("users");
    const userId = req.params.id;
    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
        const error = appErrors.createError("Invalid username or password", StatusCodes.UNAUTHORIZED, httpStatusMessage.FAIL);
        throw error;
    }
    res.status(StatusCodes.OK).json({
        status: httpStatusMessage.SUCCESS,
        data: user
    });
});

const updateUser = asyncWrapper(async (req, res) => {
    const userCollection = await getCollection("users");
    const userId = req.params.id;
    const { username, firstname, lastname, email, password } = req.body;

    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
        const error = appErrors.createError("Invalid username or password", StatusCodes.UNAUTHORIZED, httpStatusMessage.FAIL);
        throw error;
    }

    const updateFields = {};
    if (username !== undefined) updateFields.username = username;
    if (firstname !== undefined) updateFields.firstname = firstname;
    if (lastname !== undefined) updateFields.lastname = lastname;
    if (email !== undefined) updateFields.email = email;
    if (password !== undefined) updateFields.password = password;

    await userCollection.updateOne({ _id: userId }, { $set: updateFields });
    const updatedUser = await userCollection.findOne({ _id: userId });

    res.status(StatusCodes.OK).json({
        status: httpStatusMessage.SUCCESS,
        data: updatedUser
    });
});

const deleteUser = asyncWrapper(async (req, res) => {
    const userCollection = await getCollection("users");
    const userId = req.params.id;
    await userCollection.deleteOne({ _id: userId });
    res.status(StatusCodes.OK).json({
        status: httpStatusMessage.SUCCESS,
        data: { message: "User is deleted" }
    });
});

export{
    signup,
    userLogin,
    getAllUser,
    getUserById,
    updateUser,
    deleteUser
}