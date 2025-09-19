import mongoose from "mongoose";

interface GlobalWithMongoose {
  mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw Error("MONGODB_URI environment variable not found!");
}

let globalWithMongoose = global as typeof globalThis & GlobalWithMongoose;

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

// singleton function for DB connection
const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  // check if already requested for db connection
  // if so then .promise would not be null
  // else make request to db
  if (!cached.promise) {
    const opt = {
      bufferCommands: false,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, { ...opt, dbName: "pokemonDuel" })
      .then((mongoose) => {
        console.log("Connected to mongoDB server!");
        return mongoose.connection;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
