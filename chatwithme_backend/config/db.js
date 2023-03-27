import connection from "mongoose";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${connection.connection.host} : ${connection.connection.port}`;
    console.log(`Mongo DB en : ${url}`);
  } catch (error) {
    console.log(`Error : ${error.message}`);

    process.exit(1);
  }
};

export default connectDB;
