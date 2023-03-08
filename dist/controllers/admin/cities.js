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
exports.updateCover = exports.deleteCity = exports.updateCity = exports.createCity = exports.getCity = exports.listCity = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/City/repo");
const upload_1 = __importDefault(require("../../helpers/upload"));
const fs_1 = __importDefault(require("fs"));
const getPath_1 = require("../../helpers/getPath");
function listCity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let results = yield (0, repo_1.list)();
        results.map((city) => {
            if (city.cover)
                city.cover = (0, getPath_1.getPath)() + city.cover;
        });
        res.json((0, responseTypes_1.resTypes)(200, { records: results }));
    });
}
exports.listCity = listCity;
function getCity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)(req.params.id);
        if (result.success) {
            if (result.record.cover)
                result.record.cover = (0, getPath_1.getPath)() + result.record.cover;
            res.json((0, responseTypes_1.resTypes)(200, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.getCity = getCity;
function createCity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.phoneLength)
            req.body.phoneLength = parseInt(req.body.phoneLength);
        if (req.body.sort)
            req.body.sort = parseInt(req.body.sort);
        const result = yield (0, repo_1.create)(req.body);
        if (result.success) {
            yield result.record.save();
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.createCity = createCity;
function updateCity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.update)(req.params.id, req.body);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.updateCity = updateCity;
function deleteCity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.remove)(req.params.id);
        if (result.success) {
            res.json((0, responseTypes_1.resTypes)(201, { record: result.record }));
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
    });
}
exports.deleteCity = deleteCity;
function updateCover(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const city = yield (0, repo_1.get)(req.params.id);
        if (city.success) {
            (0, upload_1.default)(`cities/${city.record.code}`).parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                }
                const params = ["cover"];
                params.map((param) => {
                    if (files[param]) {
                        // delete old file
                        if (city.record[param]) {
                            try {
                                fs_1.default.unlinkSync(`./${city.record[param]}`);
                            }
                            catch (err) {
                                console.log("can't remove file", err);
                            }
                        }
                        city.record[param] = files[param].path;
                    }
                });
                yield city.record.save();
                if (city.record.cover)
                    city.record.cover = (0, getPath_1.getPath)() + city.record.cover;
                res.json((0, responseTypes_1.resTypes)(201, { record: city.record }));
            }));
        }
        else
            res.status(400).json((0, responseTypes_1.resTypes)(404));
    });
}
exports.updateCover = updateCover;
