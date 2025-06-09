import jwt from "jsonwebtoken"
import httpStatusJsend from "../utils/httpStatusJsend.js";
import StatusCodes from "../utils/statusCodes.js";
import { getCollection } from "../data/db.connection.js";


const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: httpStatusJsend.FAIL,
                message: "Authentication failed: Token missing or invalid"
            });
        }
        const token = authHeader;
        // eslint-disable-next-line no-undef
        const userCollection = await getCollection("users");
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userCollection.findOne({ username: payload.username });

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: httpStatusJsend.FAIL,
                message: "User not registered"
            });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status: httpStatusJsend.ERROR,
            message: err.message  || "Invalid or expired token" 
        });
    }
};
export default auth;