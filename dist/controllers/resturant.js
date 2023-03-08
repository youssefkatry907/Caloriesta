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
exports.updateMealImage = exports.deleteMeal = exports.updateMeal = exports.createMeal = exports.listMeals = void 0;
const responseTypes_1 = require("../helpers/responseTypes");
const repo_1 = require("../modules/Meal/repo");
const upload_1 = __importDefault(require("../helpers/upload"));
const fs_1 = __importDefault(require("fs"));
function listMeals(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.body.user._id);
        console.log(req.body.user);
        if (req.params.id) {
            const result = yield (0, repo_1.get)(req.params.id);
            if (((_a = result.record.resturant) === null || _a === void 0 ? void 0 : _a._id) == req.body.user._id)
                res.json((0, responseTypes_1.resTypes)(200, { record: result.record }));
            else
                res
                    .status(401)
                    .json((0, responseTypes_1.resTypes)(401, { message: "You're not allowed for this action" }));
        }
        else {
            const records = yield (0, repo_1.list)({ resturant: req.body.user._id });
            res.json((0, responseTypes_1.resTypes)(200, { records }));
        }
    });
}
exports.listMeals = listMeals;
function createMeal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.body.resturant = req.body.user._id;
        const result = yield (0, repo_1.create)(req.body);
        if (result.success) {
            yield result.record.save();
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.createMeal = createMeal;
function updateMeal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.body.resturant = req.body.user._id;
        const result = yield (0, repo_1.update)(req.params.id, req.body);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.updateMeal = updateMeal;
function deleteMeal(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.remove)(req.params.id);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.deleteMeal = deleteMeal;
function updateMealImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const meal = yield (0, repo_1.get)(req.params.id);
        if (meal.success) {
            (0, upload_1.default)(`users/${meal.record.resturant["username"]}/meals`).parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    res.status(400).json({
                        errors: [
                            {
                                key: "image",
                                value: "file size must be no more than 3 mb",
                            },
                        ],
                    });
                }
                const params = ["image", "offerCover"];
                params.map((param) => {
                    if (files[param]) {
                        // delete old file
                        if (meal.record[param]) {
                            try {
                                fs_1.default.unlinkSync(`./${meal.record[param]}`);
                            }
                            catch (err) {
                                console.log("can't remove file", err);
                            }
                        }
                        meal.record[param] = files[param].path;
                    }
                });
                yield meal.record.save();
                res.json((0, responseTypes_1.resTypes)(201, { record: meal.record }));
            }));
        }
        else
            res.status(400).json((0, responseTypes_1.resTypes)(404));
    });
}
exports.updateMealImage = updateMealImage;
// reports
