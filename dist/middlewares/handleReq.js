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
exports.handleCityReq = void 0;
const jwt_1 = require("../helpers/jwt");
const responseTypes_1 = require("../helpers/responseTypes");
const repo_1 = require("../modules/City/repo");
function handleReq(req, res, next) {
    const exclude = [
        "/login",
        "/register",
        "/reset-password-code",
        "/validate-reset-code",
        "/reset-password",
    ];
    if (!exclude.includes(req.url)) {
        if (req.headers.authorization && req.headers.authorization.split(" ")[1]) {
            let token = req.headers.authorization.split(" ")[1];
            if (token && (0, jwt_1.verifyToken)(token))
                req.body.user = (0, jwt_1.verifyToken)(token);
            else
                res.json((0, responseTypes_1.resTypes)(401));
        }
        else
            res.json((0, responseTypes_1.resTypes)(401));
    }
    next();
}
exports.default = handleReq;
function handleCityReq(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.city) {
            const city = yield (0, repo_1.get)(req.headers.city, "code");
            if (city.success) {
                req.body.city = city.record;
                next();
            }
            else
                res.status(400).json((0, responseTypes_1.resTypes)(400, { message: "country not found" }));
        }
        else
            res
                .status(400)
                .json((0, responseTypes_1.resTypes)(400, { message: "must send country code to filter data" }));
    });
}
exports.handleCityReq = handleCityReq;
