
import { validationResult } from "express-validator"
import { getCollection } from "../data/db.connection.js"
// import { courses } from "../data/cousres.data.js"

const getAllcourses =async (req,res)=>{

    const coursesCollection = await getCollection("courses");
    const courses = await coursesCollection.find().toArray();
    res.json(courses);
}

const getCourseById =(req,res)=>{
    const courseId = +req.params.courseId ;
    const course = courses.find((course)=> course.id === courseId);
    if(!course){
        return res.statu(500).json({message:errors.array()})
    }
    res.json(course)
} 
const createCourse =(req ,res)=>{
    const errors =validationResult(req.body);
    if(!errors.isEmpty()){
        return res.status(500).json({message:errors.array()})
    }
    courses.push({id:courses.length +1 ,...req.body});
    res.json(courses[courses.length-1])
}

const updateCourse =(req,res)=>{
    const courseId = +req.params.courseId ;
    const inputData =req.body;
    const course = courses.find((course)=> course.id === courseId);
    if(!course){
        return res.statu(500).json({message:errors.array()})
    }
    if(inputData.title !== undefined) course.title =inputData.title;
    if (inputData.description !== undefined) course.description = inputData.description;
    if (inputData.price !== undefined) course.price = inputData.price;
    if (inputData.instructor !== undefined) course.instructor = inputData.instructor;
    if (inputData.duration !== undefined) course.duration = inputData.duration;
    if (inputData.level !== undefined) course.level = inputData.level;
    res.json(course);
}
const deleteCourse = (req,res)=>{
    const courseId = +req.params.courseId ;
    const course = courses.find((course)=> course.id === courseId);
    if(!course){
        return res.statu(500).json({message:errors.array()})
    }
    res.json(courses.filter((course)=>{ return course.id != courseId}));
}

export default{
    getAllcourses,
    updateCourse,
    getCourseById,
    deleteCourse,
    createCourse
}