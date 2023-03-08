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
exports.sendMessage = exports.getPage = exports.categories = exports.industries = exports.cities = void 0;
const repo_1 = require("../../modules/City/repo");
const repo_2 = require("../../modules/Industry/repo");
const repo_3 = require("../../modules/Category/repo");
const responseTypes_1 = require("../../helpers/responseTypes");
const model_1 = __importDefault(require("../../modules/Page/model"));
const model_2 = __importDefault(require("../../modules/Message/model"));
function cities(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const result = yield (0, repo_1.get)(req.params.id);
            result.success
                ? res.json((0, responseTypes_1.resTypes)(200, { record: result.record }))
                : res.json((0, responseTypes_1.resTypes)(404, { errors: result.errors }));
        }
        else {
            const records = yield (0, repo_1.list)();
            res.json((0, responseTypes_1.resTypes)(200, { records }));
        }
    });
}
exports.cities = cities;
function industries(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const result = yield (0, repo_2.get)(req.params.id);
            if (result.success) {
                res.json((0, responseTypes_1.resTypes)(200, { record: result.record }));
            }
            else
                res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
        }
        else {
            const records = yield (0, repo_2.list)();
            res.json((0, responseTypes_1.resTypes)(200, { records }));
        }
    });
}
exports.industries = industries;
function categories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const result = yield (0, repo_3.get)(req.params.id);
            res.json((0, responseTypes_1.resTypes)(200, { record: result.record }));
        }
        else {
            const records = yield (0, repo_3.list)();
            res.json((0, responseTypes_1.resTypes)(200, { records }));
        }
    });
}
exports.categories = categories;
function getPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield model_1.default.findOne({});
        res.json((0, responseTypes_1.resTypes)(200, {
            record: record[`${req.query.type}`],
        }));
    });
}
exports.getPage = getPage;
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.body.name && req.body.phone && req.body.message) {
            const message = new model_2.default(req.body);
            yield message.save();
            res.json((0, responseTypes_1.resTypes)(200, {
                record: message,
            }));
        }
        else {
            res.json((0, responseTypes_1.resTypes)(400, {
                message: "name, phone, message are required",
            }));
        }
    });
}
exports.sendMessage = sendMessage;
