import { validationResult } from "express-validator";
import { getCollection } from "../data/db.connection.js";
import { ObjectId } from "mongodb";

import asyncWrapper from "../middleware/asyncWrapper.js";
import httpStatusMessage from "../utils/httpStatusJsend.js";
import appError from "../utils/appError.js";
import StatusCodes from "../utils/statusCodes.js";
const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = StatusCodes;
const getAllcourses = asyncWrapper(async (req, res) => {
    const query =req.query;
    const coursesCollection = await getCollection("courses");
    // pagination 
    if(query || Object.keys(query).length !== 0) {
        const limit = +query.limit;
        const page = +query.page ;
        const skip =(page -1) * limit;
        const courses = await coursesCollection.find().limit(limit).skip(skip).toArray();
        return res.status(CREATED).json({
            status: "success",
            data: { courses },
    });
    }
    else{
        const courses = await coursesCollection.find().toArray();
        return res.status(CREATED).json({
                                status: "success",
                                data: { courses },
                            });
    }
});
const getCourseById = asyncWrapper(async (req, res) => {
    const courseId = new ObjectId(req.params.courseId);
    const coursesCollection = await getCollection("courses");

    const course = await coursesCollection.findOne({ _id: courseId });
    if (!course) {
        const error = appError.create(
            NOT_FOUND,
            "Course not found",
            httpStatusMessage.ERROR
        );
        throw error;
    }
    res.status(OK).json({
        status: "success",
        data: { course },
    });
});

const createCourse = asyncWrapper(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = appError.create(
            BAD_REQUEST,
            "Validation failed",
            httpStatusMessage.FAIL,
            { errors: errors.array() }
        );
        throw error;
    }

    const coursesCollection = await getCollection("courses");

    if (Array.isArray(req.body)) {
        await coursesCollection.insertMany(req.body);
        return res.status(CREATED).json({
            status: "success",
            data: { message: "Course Created" },
        });
    }

    if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
        await coursesCollection.insertOne(req.body);
        return res.status(CREATED).json({
            status: "success",
            data: { message: "Course Created" },
        });
    }
    const error = appError.create(
        BAD_REQUEST,
        "Invalid request body",
        httpStatusMessage.FAIL
    );
    throw error;
});

const updateCourse = asyncWrapper(async (req, res) => {
    const courseId = new ObjectId(req.params.courseId);
    const coursesCollection = await getCollection("courses");

    const course = await coursesCollection.findOne({ _id: courseId });
    if (!course) {
        const error = appError.create(
            NOT_FOUND,
            "Course not found",
            httpStatusMessage.ERROR
        );
        throw error;
    }

    const inputData = req.body;
    const updateData = {};

    ["title", "description", "price", "instructor", "duration", "level"].forEach(
        (key) => {
            if (inputData[key] !== undefined) {
                updateData[key] = inputData[key];
            }
        }
    );

    const updated = await coursesCollection.findOneAndUpdate(
        { _id: courseId },
        { $set: updateData },
        { returnDocument: "after" }
    );

    res.status(OK).json({
        status: "success",
        data: { course: updated.value },
    });
});

const deleteAllCourses = asyncWrapper(async (req, res) => {
    const coursesCollection = await getCollection("courses");
    const result = await coursesCollection.deleteMany({});
    res.status(OK).json({
        status: "success",
        message: "All courses deleted successfully",
        deletedCount: result.deletedCount,
    });
});

const deleteCourse = asyncWrapper(async (req, res) => {
    const courseId = new ObjectId(req.params.courseId);
    const coursesCollection = await getCollection("courses");

    const course = await coursesCollection.findOne({ _id: courseId });
    if (!course) {
        const error = appError.create(
            NOT_FOUND,
            "Course not found",
            httpStatusMessage.ERROR
        );
        throw error;
    }

    const result = await coursesCollection.deleteOne({ _id: courseId });
    res.status(OK).json({
        status: "success",
        message: "Deleted successfully",
        deletedCount: result.deletedCount,
    });
});

export default {
    getAllcourses,
    updateCourse,
    getCourseById,
    deleteCourse,
    createCourse,
    deleteAllCourses,
};
