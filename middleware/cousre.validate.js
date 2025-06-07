import { body } from "express-validator";

export const validate = ()=>{
    return [
        body("title")
                .isEmpty()
                .withMessage("title must be not empty")
                .isLength({min:3})
                .withMessage("title lenght must be more than 3 letters"),
        body("price")
                .isEmpty()
                .withMessage("Price must be not empty")
                .isNumeric()
                .withMessage("Price must be number")
                .isLength({min:1})
                .withMessage("Price must at least 1 number"),
        body("description")
                .isEmpty()
                .withMessage("Price must be not empty")
                .isLength({min:1})
                .withMessage("Price must at least 1 number"),
        body("instructor")
                .isEmpty()
                .withMessage("Price must be not empty")
                .isLength({min:1})
                .withMessage("Price must at least 1 number"),
        body("duration")
                .isEmpty()
                .withMessage("Price must be not empty")
                .isLength({min:1})
                .withMessage("Price must at least 1 number"),
        body("level")
                .isEmpty()
                .withMessage("Price must be not empty")
                .isLength({min:1})
                .withMessage("Price must at least 1 number")
    ]
}