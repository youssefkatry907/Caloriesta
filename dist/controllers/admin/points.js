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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMealFromPoint = exports.addMealToPoint = exports.deletePointOfSale = exports.updatePointOfSale = exports.createPointOfSale = exports.getPointOfSale = exports.listPointsOfSales = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/PointOfSale/repo");
function listPointsOfSales(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let results = yield (0, repo_1.list)();
        res.json((0, responseTypes_1.resTypes)(200, { records: results }));
    });
}
exports.listPointsOfSales = listPointsOfSales;
function getPointOfSale(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)(req.params.id);
        if (result.success)
            res.json((0, responseTypes_1.resTypes)(200, { record: result.record }));
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.getPointOfSale = getPointOfSale;
function createPointOfSale(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.create)(req.body);
        if (result.success) {
            yield result.record.save();
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.createPointOfSale = createPointOfSale;
function updatePointOfSale(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.update)(req.params.id, req.body);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.updatePointOfSale = updatePointOfSale;
function deletePointOfSale(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.remove)(req.params.id);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.deletePointOfSale = deletePointOfSale;
function addMealToPoint(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let pointId = req.params.pointId;
        let mealId = req.params.mealId;
        const result = yield (0, repo_1.addMeal)(pointId, mealId);
        if (result.success) {
            yield result.record.save();
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.addMealToPoint = addMealToPoint;
function removeMealFromPoint(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let pointId = req.params.pointId;
        let mealId = req.params.mealId;
        const result = yield (0, repo_1.removeMeal)(pointId, mealId);
        if (result.success) {
            yield result.record.save();
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.removeMealFromPoint = removeMealFromPoint;
