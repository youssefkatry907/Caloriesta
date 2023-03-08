"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("../model"));
const mongoose_1 = __importDefault(require("mongoose"));
function getNested(category) {
    return __awaiter(this, void 0, void 0, function* () {
        let categories = [];
        let target = yield model_1.default.findOne({
            _id: mongoose_1.default.Types.ObjectId(category),
        }).populate({
            path: "subCategories",
            select: "name",
            populate: {
                path: "subCategories",
                select: "name",
                populate: {
                    path: "subCategories",
                    select: "name",
                    populate: {
                        path: "subCategories",
                        select: "name",
                        populate: {
                            path: "subCategories",
                            select: "name",
                        },
                    },
                },
            },
        });
        if (target) {
            categories.push(target._id);
            if (target.subCategories.length)
                getSub(target);
        }
        function getSub(one) {
            if (one && one.subCategories && one.subCategories.length) {
                one.subCategories.map((s) => {
                    categories.push(s._id);
                    getSub(s);
                });
            }
        }
        return categories;
    });
}
exports.default = getNested;
