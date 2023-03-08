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
exports.updateFiles = exports.updateSettings = exports.getSettings = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/Info/repo");
const upload_1 = __importDefault(require("../../helpers/upload"));
const fs_1 = __importDefault(require("fs"));
function getSettings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)();
        res.json((0, responseTypes_1.resTypes)(200, { record: result.settings }));
    });
}
exports.getSettings = getSettings;
function updateSettings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { settings } = yield (0, repo_1.update)(req.body);
        res.json((0, responseTypes_1.resTypes)(200, {
            record: settings,
        }));
    });
}
exports.updateSettings = updateSettings;
function updateFiles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield (0, repo_1.get)();
        (0, upload_1.default)(`settings`).parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            const params = ["logoAr", "logoEn", "favico"];
            params.map((param) => {
                if (files[param]) {
                    // delete old file
                    if (result.settings[param]) {
                        try {
                            fs_1.default.unlinkSync(`./${result.settings[param]}`);
                        }
                        catch (err) {
                            console.log("can't remove file", err);
                        }
                    }
                    result.settings[param] = files[param].path;
                }
            });
            yield result.settings.save();
            res.json((0, responseTypes_1.resTypes)(201, { record: result.settings }));
        }));
    });
}
exports.updateFiles = updateFiles;
