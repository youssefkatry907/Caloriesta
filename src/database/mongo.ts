import mongoose, { ConnectOptions } from "mongoose";
import dontenv from "dotenv";

dontenv.config();

const db = mongoose.connection;

const mongoDB =
  process.env.NODE_ENV == "development"
    ? `mongodb://localhost:27017/caloriesta`
    : `mongodb://localhost:27017/caloriesta`;

const options: ConnectOptions = {
  autoIndex: false,
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
  useCreateIndex: false,
};
mongoose.connect(mongoDB, options);

db.once("open", () => {
  console.log(
    `Successfully connected to database in ${process.env.NODE_ENV} mode`
  );
});

db.on("error", console.error.bind(console, "MongoDB connection error:"));

export default mongoose;
