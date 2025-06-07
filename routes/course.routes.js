import express from "express"

import { validate } from "../middleware/cousre.validate.js";
import courseControle from "../controllers/course.controllers.js";

const courseRoute = express.Router();

courseRoute.route("/")
                .get(courseControle.getAllcourses)
                .post(validate(),courseControle.createCourse)
courseRoute.route("/:courseId")
                .patch(courseControle.updateCourse)
                .delete(courseControle.deleteCourse)
                .get(courseControle.getCourseById)

export default courseRoute;