import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is missing");
}

const client = new MongoClient(uri);
const db = client.db("Recipe_Hub");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  trustedOrigins: [
    "https://recipe-hub-f35f-git-main-mahi999-maxs-projects.vercel.app",
    "https://recipe-hub-f35f.vercel.app",
    "http://localhost:3000",
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      isPremium: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      premiumSince: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
});