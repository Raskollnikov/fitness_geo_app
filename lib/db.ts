// lib/db.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function connectToDB() {
  const client = await clientPromise;
  return client.db("projectUni"); // You can name your DB here
}
