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
exports.update = exports.get = void 0;
const encrypt_1 = require("../../utilities/encrypt");
const model_1 = __importDefault(require("./model"));
function get() {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield model_1.default.find();
        return {
            settings: info[0].info(),
        };
    });
}
exports.get = get;
function update(form) {
    return __awaiter(this, void 0, void 0, function* () {
        const isFound = yield get();
        console.log(isFound);
        if (form.password)
            form.password = yield (0, encrypt_1.encrypt)(form.password);
        try {
            yield model_1.default.updateOne({ _id: isFound.settings._id }, form, {
                runValidators: true,
            });
            const updatedRecord = yield get();
            return updatedRecord;
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.update = update;
