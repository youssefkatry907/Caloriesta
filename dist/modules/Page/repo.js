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
exports.update = exports.get = exports.list = void 0;
const model_1 = __importDefault(require("./model"));
function list(query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const records = yield model_1.default.findOne(query);
        return records;
    });
}
exports.list = list;
function get(id, query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (id)
            return yield isExist(id);
        else {
            return {
                success: false,
                code: 400,
                errors: [
                    {
                        key: "id",
                        value: `id is missed`,
                    },
                ],
            };
        }
    });
}
exports.get = get;
function update(id, form) {
    return __awaiter(this, void 0, void 0, function* () {
        const isFound = yield isExist(id);
        if (id && isFound.success) {
            isFound.record[form["type"]] = form["content"];
            yield isFound.record.save();
        }
        return true;
    });
}
exports.update = update;
function isExist(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield model_1.default.find({});
        if (record[0]) {
            return {
                success: true,
                record: record[0],
                code: 200,
            };
        }
        else {
            return {
                code: 404,
                success: false,
                errors: [
                    {
                        key: "record",
                        value: `record not found`,
                    },
                ],
            };
        }
    });
}
