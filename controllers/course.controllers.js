import { validationResult } from "express-validator";
import { getCollection } from "../data/db.connection.js";
import { ObjectId } from "mongodb";

const getAllcourses = async (req, res) => {
    try {
        const coursesCollection = await getCollection("courses");
        const courses = await coursesCollection.find().toArray();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
};

const getCourseById = async (req, res) => {
    try {
        const courseId = new ObjectId(req.params.courseId);
        const coursesCollection = await getCollection("courses");
        const course = await coursesCollection.findOne({ _id: courseId });
        if (!course) {
        return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
};

const createCourse = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const coursesCollection = await getCollection("courses");

        if (Array.isArray(req.body)) {
        await coursesCollection.insertMany(req.body);
        return res.status(201).json({ message: "Courses created" });
        }

        if (req.body && typeof req.body === "object" && !Array.isArray(req.body)) {
        await coursesCollection.insertOne(req.body);
        return res.status(201).json({ message: "Course created" });
        }

        res.status(400).json({ message: "Invalid request body" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
};

const updateCourse = async (req, res) => {
    try {
        const courseId = new ObjectId(req.params.courseId);
        const coursesCollection = await getCollection("courses");

        const course = await coursesCollection.findOne({ _id: courseId });
        if (!course) {
        return res.status(404).json({ message: "Course not found" });
        }

        const inputData = req.body;
        const updateData = {};

        [
        "title",
        "description",
        "price",
        "instructor",
        "duration",
        "level",
        ].forEach((key) => {
        if (inputData[key] !== undefined) {
            updateData[key] = inputData[key];
        }
        });

        const updatedCourse = await coursesCollection.findOneAndUpdate(
        { _id: courseId },
        { $set: updateData },
        { returnDocument: "after" }
        );

        res.json(updatedCourse);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const courseId = new ObjectId(req.params.courseId);
        const coursesCollection = await getCollection("courses");

        const course = await coursesCollection.findOne({ _id: courseId });
        if (!course) {
        return res.status(404).json({ message: "Course not found" });
        }

        const result = await coursesCollection.deleteOne({ _id: courseId });
        res.json({
        message: "Deleted successfully",
        deletedCount: result.deletedCount,
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
};

export default {
    getAllcourses,
    updateCourse,
    getCourseById,
    deleteCourse,
    createCourse,
};
