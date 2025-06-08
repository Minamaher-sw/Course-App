
import express  from "express";
import cors from "cors";

import courseRoute from "./routes/course.routes.js";
import httpStatusMessage from "./utils/httpStatusJsend.js"
const app =express();
// app.use(bodyParser.json());
app.use(cors());
// parser
app.use(express.json());

app.use("/api/courses",courseRoute)



// wildcard 
app.all("*",(req,res,next)=>{
    res.status(404).json({
    status :httpStatusMessage.FAIL ,
    data : {message: "Route not found" }}
)});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
    status : err.statusText || httpStatusMessage.ERROR ,
    data : {message: err.message || "Internal Server Error"}}
)
})

app.listen(3001,"127.0.0.1",511,()=>{
    console.log("server is connected")
}).on("error",(err)=>{
    console.log(err);
})