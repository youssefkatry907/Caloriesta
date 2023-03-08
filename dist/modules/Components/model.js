"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Component = new mongo_1.default.Schema({
    name: {
        ar: {
            type: String,
        },
        en: {
            type: String,
        },
    },
    cover: String,
    type: {
        type: String,
        enum: [
            "slider",
            "categories",
            "latestProducts",
            "newestProducts",
            "categoryProducts",
            "twoBanners",
            "singleBanner",
            "brands",
        ],
    },
}, {
    timestamps: true,
});
exports.default = mongo_1.default.model("Component", Component);
