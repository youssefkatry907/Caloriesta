"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = mongoose_1.default.connection;
const mongoDB = process.env.NODE_ENV == "development"
    ? `mongodb://localhost:27017/caloriesta`
    : `mongodb://localhost:27017/caloriesta`;
const options = {
    autoIndex: false,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: false,
};
mongoose_1.default.connect(mongoDB, options);
db.once("open", () => {
    console.log(`Successfully connected to database in ${process.env.NODE_ENV} mode`);
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));
exports.default = mongoose_1.default;
