import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is missing");
}

const client = new MongoClient(uri);
const db = client.db("Recipe_Hub");

console.log("Connected database name:", db.databaseName);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
});