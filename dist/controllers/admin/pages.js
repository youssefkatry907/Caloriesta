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
exports.updatePage = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const model_1 = __importDefault(require("../../modules/Page/model"));
function updatePage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield model_1.default.findOne({});
        if (record) {
            record[`${req.query["type"]}`] = req.body["content"];
            yield record.save();
        }
        res.json((0, responseTypes_1.resTypes)(200, {
            record: record[`${req.query["type"]}`],
            message: "page has been updated",
        }));
    });
}
exports.updatePage = updatePage;
