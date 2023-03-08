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
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.listCoupons = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/Coupon/repo");
function listCoupons(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const result = yield (0, repo_1.get)(req.params.id);
            res.json((0, responseTypes_1.resTypes)(200, { record: result.record }));
        }
        else {
            const records = yield (0, repo_1.list)();
            res.json((0, responseTypes_1.resTypes)(200, { records }));
        }
    });
}
exports.listCoupons = listCoupons;
function createCoupon(req, res) {
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
exports.createCoupon = createCoupon;
function updateCoupon(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.update)(req.params.id, req.body);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.updateCoupon = updateCoupon;
function deleteCoupon(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.remove)(req.params.id);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.deleteCoupon = deleteCoupon;
