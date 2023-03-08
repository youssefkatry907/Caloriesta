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
exports.customQuery = exports.remove = exports.update = exports.create = exports.get = exports.list = void 0;
const encrypt_1 = require("../../utilities/encrypt");
const username_1 = require("../../helpers/username");
const model_1 = __importDefault(require("./model"));
function list(query = {}, cp = null, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const records = yield model_1.default.find(query, cp, options).populate("industry");
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
function create(form) {
    return __awaiter(this, void 0, void 0, function* () {
        let availableParams = [];
        if (form["email"])
            availableParams.push({ email: form["email"].toLowerCase() });
        if (form["phone"])
            availableParams.push({ phone: form["phone"] });
        if (form["username"])
            availableParams.push({ username: (0, username_1.handleUsername)(form["username"]) });
        const duplicated = yield isParamsDuplicate({
            $or: availableParams,
        });
        if (duplicated) {
            return {
                success: false,
                code: 409,
                errors: [
                    {
                        key: "error",
                        value: `email or phone already taken`,
                    },
                ],
            };
        }
        else {
            form.hashedPassword = yield (0, encrypt_1.encrypt)(form.password);
            try {
                const newRecord = new model_1.default(form);
                yield newRecord.save();
                return {
                    success: true,
                    record: newRecord,
                    code: 200,
                };
            }
            catch (err) {
                return {
                    success: false,
                    errors: err,
                    code: 400,
                };
            }
        }
    });
}
exports.create = create;
function update(id, form) {
    return __awaiter(this, void 0, void 0, function* () {
        const isFound = yield isExist(id);
        if (id && isFound.success) {
            if (form.password)
                form.hashedPassword = yield (0, encrypt_1.encrypt)(form.password);
            yield model_1.default.updateOne({ _id: id }, form, {
                runValidators: true,
            });
        }
        const updatedRecord = yield isExist(id);
        return updatedRecord;
    });
}
exports.update = update;
function remove(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isFound = yield isExist(id);
        if (id && isFound.success)
            yield model_1.default.deleteOne({ _id: id });
        return isFound;
    });
}
exports.remove = remove;
function isParamsDuplicate(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield model_1.default.findOne(query);
        return record;
    });
}
function isExist(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let record = yield model_1.default.findOne({ _id: id }).populate({
            path: "",
        });
        if (record) {
            return {
                success: true,
                record,
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
function customQuery(matchQuery, lookup, unwind, project, limit, sort) {
    return __awaiter(this, void 0, void 0, function* () {
        let queries = [];
        if (matchQuery)
            queries.push({ $match: matchQuery });
        if (lookup)
            queries.push({ $lookup: lookup });
        if (unwind)
            queries.push({ $unwind: unwind });
        if (limit)
            queries.push({
                $limit: limit,
            });
        if (sort)
            queries.push({
                $sort: sort,
            });
        if (project)
            queries.push({ $project: project });
        const result = yield model_1.default.aggregate(queries);
        return result;
    });
}
exports.customQuery = customQuery;
