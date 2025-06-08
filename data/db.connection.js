import { MongoClient } from "mongodb";

const url = "mongodb+srv://menamosadef5:AXtRP2qWp5gzYMCA@cluster0.pvwc5cz.mongodb.net/?retryWrites=true&w=majority";

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