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
exports.removeMeal = exports.addMeal = exports.remove = exports.update = exports.create = exports.get = exports.list = void 0;
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../Meal/model"));
function list(query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const records = yield model_1.default.find(query);
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
        if (yield isNameDuplicate(form["name"])) {
            return {
                success: false,
                code: 400,
                errors: [
                    {
                        key: "name",
                        value: `${form["name"]} already taken`,
                    },
                ],
            };
        }
        else {
            const newRecord = new model_1.default(form);
            return {
                success: true,
                record: newRecord,
                code: 200,
            };
        }
    });
}
exports.create = create;
function update(id, form) {
    return __awaiter(this, void 0, void 0, function* () {
        const isFound = yield isExist(id);
        if (id && isFound.success) {
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
        if (id && isFound.success) {
            yield model_1.default.deleteOne({ _id: id });
        }
        return isFound;
    });
}
exports.remove = remove;
function addMeal(pointId, mealId) {
    return __awaiter(this, void 0, void 0, function* () {
        const isPointFound = yield isExist(pointId);
        const isMealFound = yield model_2.default.find({ _id: mealId });
        if (pointId && isPointFound.success && mealId && isMealFound) {
            if ((isPointFound.record.meals).includes(mealId)) {
                return {
                    code: 400,
                    success: false,
                    errors: [
                        {
                            key: "meal",
                            value: `meal already exist`,
                        },
                    ],
                };
            }
            else {
                yield model_1.default.updateOne({ _id: pointId }, { "$push": { meals: mealId } }, {
                    runValidators: true,
                });
            }
        }
        const updatedRecord = yield isExist(pointId);
        return updatedRecord;
    });
}
exports.addMeal = addMeal;
function removeMeal(pointId, mealId) {
    return __awaiter(this, void 0, void 0, function* () {
        const isPointFound = yield isExist(pointId);
        const isMealFound = yield model_2.default.find({ _id: mealId });
        if (pointId && isPointFound.success && mealId && isMealFound) {
            if ((isPointFound.record.meals).includes(mealId)) {
                yield model_1.default.updateOne({ _id: pointId }, { "$pull": { meals: mealId } }, {
                    runValidators: true,
                });
            }
            else {
                return {
                    code: 404,
                    success: false,
                    errors: [
                        {
                            key: "meal",
                            value: `meal not found`,
                        },
                    ],
                };
            }
        }
        const updatedRecord = yield isExist(pointId);
        return updatedRecord;
    });
}
exports.removeMeal = removeMeal;
function isNameDuplicate(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield model_1.default.findOne({ name: name });
        return record;
    });
}
function isExist(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield model_1.default.findOne({ _id: id });
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
