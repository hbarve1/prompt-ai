import mongoose from "mongoose";

// track if database is connected
let isConnected: boolean = false; 

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("=> using existing database connection");
    return Promise.resolve();
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      dbName: process.env.DB_NAME,
    });

    isConnected = true;

    console.log("=> using new database connection");
  } catch (error) {
    console.log("=> an error occurred when connecting to the database", error);

    // throw error;
  }
}