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
exports.updateOrder = exports.listOrders = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/Order/repo");
function listOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const records = yield (0, repo_1.list)();
        res.json((0, responseTypes_1.resTypes)(200, { records }));
    });
}
exports.listOrders = listOrders;
function updateOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.status) {
            req.body.status = req.params.status;
        }
        console.log(req.body.status);
        const result = yield (0, repo_1.update)(req.params.id, req.body);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.updateOrder = updateOrder;
