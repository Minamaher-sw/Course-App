import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config(); // Add this FIRST before any other imports
const url = process.env.MONGO_URI;
if (!url) {
    throw new Error("MongoDB connection string is undefined!");
}

const client = new MongoClient(url, { serverSelectionTimeoutMS: 10000 });

let db;

export const connectToDB = async () => {
    if (!db) {
        await client.connect();
        db = client.db("codezone2");
        console.log("✅ MongoDB Connected");
    }
    return db;
};

export const getCollection = async (collectionName) => {
    const database = await connectToDB();
    return database.collection(collectionName);
};