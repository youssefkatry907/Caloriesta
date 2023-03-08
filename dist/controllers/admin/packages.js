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
exports.updateCover = exports.deletePackage = exports.updatePackage = exports.createPackage = exports.getPackage = exports.listPackage = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/Package/repo");
const upload_1 = __importDefault(require("../../helpers/upload"));
const fs_1 = __importDefault(require("fs"));
const getPath_1 = require("../../helpers/getPath");
function listPackage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let results = yield (0, repo_1.list)();
        results.map((p) => {
            if (p.cover)
                p.cover = (0, getPath_1.getPath)() + p.cover;
        });
        res.json((0, responseTypes_1.resTypes)(200, { records: results }));
    });
}
exports.listPackage = listPackage;
function getPackage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)(req.params.id);
        if (result.success) {
            if (result.record.icon)
                result.record.icon = (0, getPath_1.getPath)() + result.record.icon;
            res.json((0, responseTypes_1.resTypes)(200, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.getPackage = getPackage;
function createPackage(req, res) {
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
exports.createPackage = createPackage;
function updatePackage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.update)(req.params.id, req.body);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.updatePackage = updatePackage;
function deletePackage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.remove)(req.params.id);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.deletePackage = deletePackage;
function updateCover(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield (0, repo_1.get)(req.params.id);
        if (p.success) {
            (0, upload_1.default)(`packages/${p.record.code}`).parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                }
                const params = ["icon"];
                params.map((param) => {
                    if (files[param]) {
                        // delete old file
                        if (p.record[param]) {
                            try {
                                fs_1.default.unlinkSync(`./${p.record[param]}`);
                            }
                            catch (err) {
                                console.log("can't remove file", err);
                            }
                        }
                        p.record[param] = files[param].path;
                    }
                });
                yield p.record.save();
                if (p.record.icon)
                    p.record.icon = (0, getPath_1.getPath)() + p.record.icon;
                res.json((0, responseTypes_1.resTypes)(201, { record: p.record }));
            }));
        }
        else
            res.status(400).json((0, responseTypes_1.resTypes)(404));
    });
}
exports.updateCover = updateCover;
