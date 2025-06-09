import  { body } from 'express-validator';
import { getCollection } from "../data/db.connection.js";

const userValidationRules = ()=>{
    return [
   body('email')
    .isEmail().withMessage('Email is invalid')
    .custom(async (email) => {
        const userCollection = await getCollection("users");

        const user = await userCollection.findOne({ email });

        if (user) {
            console.log("⚠️ Email already exists:", email);
            throw new Error('Email already in use');
        }

        console.log("✅ Email is available:", email);
        return true;
    }),
    body('username')
        .notEmpty().withMessage('Username is required')
        .custom(async (username) => {
            const userCollection = await getCollection("users");
            const user = await userCollection.findOne({ username });
            if (user) {
                throw new Error('Username already in use');
            }
            return true;
        }),
    body('firstname')
        .notEmpty().withMessage('Firstname is required'),
    body('lastname')
        .notEmpty().withMessage('Lastname is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
];
}
export default userValidationRules;