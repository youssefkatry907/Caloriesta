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
exports.removeMessage = exports.listMessages = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/Message/repo");
function listMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const record = yield (0, repo_1.get)(req.params.id);
            if (record.success) {
                res.json((0, responseTypes_1.resTypes)(200, {
                    record: record.record,
                }));
            }
            else {
                res.json((0, responseTypes_1.resTypes)(404, {
                    message: "message not found",
                }));
            }
        }
        else {
            const records = yield (0, repo_1.list)();
            res.json((0, responseTypes_1.resTypes)(200, {
                records,
            }));
        }
    });
}
exports.listMessages = listMessages;
function removeMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = yield (0, repo_1.get)(req.params.id);
        if (message.success) {
            yield (0, repo_1.remove)(req.params.id);
            res.json((0, responseTypes_1.resTypes)(200, {
                message: "message has been removed",
            }));
        }
        else {
            res.json((0, responseTypes_1.resTypes)(404, {
                message: "message not found",
            }));
        }
    });
}
exports.removeMessage = removeMessage;
