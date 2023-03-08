"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Filter = new mongo_1.default.Schema({
    admin: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Admin" },
    name: {
        ar: {
            type: String,
        },
        en: {
            type: String,
        },
    },
    slug: String,
    sort: Number,
    attributes: [{ type: mongo_1.default.SchemaTypes.ObjectId, ref: "Attribute" }],
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Filter", Filter);
