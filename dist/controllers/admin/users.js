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
exports.removeUser = exports.toggleIsTop = exports.toggleUserActive = exports.updateUserFiles = exports.updateUser = exports.createUser = exports.listUser = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/User/repo");
const customer_1 = require("../customer");
function listUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const result = yield (0, repo_1.get)(req.params.id);
            return result.success
                ? res.json((0, responseTypes_1.resTypes)(200, { record: result.record }))
                : res.status(result.code).json((0, responseTypes_1.resTypes)(result.code, result));
        }
        let results = yield (0, repo_1.list)({ type: { $in: req.query.type } });
        res.json((0, responseTypes_1.resTypes)(200, { records: results }));
    });
}
exports.listUser = listUser;
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, customer_1.register)(req, res);
    });
}
exports.createUser = createUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)(req.params.id);
        req.body.user = result.record;
        yield (0, customer_1.updateInfo)(req, res);
    });
}
exports.updateUser = updateUser;
function updateUserFiles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)(req.params.id);
        req.body.user = result.record;
        yield (0, customer_1.updateFiles)(req, res);
    });
}
exports.updateUserFiles = updateUserFiles;
function toggleUserActive(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)(req.params.id);
        if (result.success) {
            result.record.isActive = !result.record.isActive;
            yield result.record.save();
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.toggleUserActive = toggleUserActive;
function toggleIsTop(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)(req.params.id);
        if (result.success) {
            result.record.isTop = !result.record.isTop;
            yield result.record.save();
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.toggleIsTop = toggleIsTop;
function removeUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.remove)(req.params.id);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.removeUser = removeUser;
