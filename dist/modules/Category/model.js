"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Category = new mongo_1.default.Schema({
    name: {
        ar: {
            type: String,
        },
        en: {
            type: String,
        },
    },
    cover: String,
    banner: {
        ar: String,
        en: String,
    },
    sort: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isParent: { type: Boolean, default: false },
    parent: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Category" },
    subCategories: [{ type: mongo_1.default.SchemaTypes.ObjectId, ref: "Category" }],
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Category", Category);
