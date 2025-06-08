
import express  from "express";
import courseRoute from "./routes/course.routes.js";
const app =express();

// app.use(bodyParser.json());
// parser
app.use(express.json());

app.use("/api/courses",courseRoute)


app.listen(3001,"127.0.0.1",511,()=>{
    console.log("server is connected")
}).on("error",(err)=>{
    console.log(err);
})