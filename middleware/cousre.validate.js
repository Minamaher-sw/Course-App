import { body } from "express-validator";
/**
 * Course validation middleware using express-validator.
 * Validates title, price, description, instructor, duration, and level fields.
 */
export const validate = () => {
return [
        body("courses").optional().isArray().withMessage("courses must be an array"),
        body("courses.*.title")
                .notEmpty()
                .withMessage("title in array must be not empty")
                .isLength({ min: 3 })
                .withMessage("title in array length must be more than 3 letters"),
        body("courses.*.price")
                .notEmpty()
                .withMessage("price in array must be not empty")
                .isNumeric()
                .withMessage("price in array must be a number"),
        body("courses.*.description")
                .notEmpty()
                .withMessage("description in array must be not empty")
                .isLength({ min: 5 })
                .withMessage("description in array must be at least 5 characters long"),
        body("courses.*.instructor")
                .notEmpty()
                .withMessage("instructor in array must be not empty"),
        body("courses.*.duration")
                .notEmpty()
                .withMessage("duration in array must be not empty"),
        body("courses.*.level")
                .notEmpty()
                .withMessage("level in array must be not empty"),
];
};