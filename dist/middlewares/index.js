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
exports.isCan = exports.isAdmin = exports.isCustomer = void 0;
const isCan_1 = require("../helpers/isCan");
const jwt_1 = require("../helpers/jwt");
const responseTypes_1 = require("../helpers/responseTypes");
const model_1 = __importDefault(require("../modules/User/model"));
function isCustomer(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1];
            const user = yield model_1.default.isExist((0, jwt_1.verifyToken)(token).email);
            if ((0, jwt_1.verifyToken)(token) && user) {
                req["user"] = (0, jwt_1.verifyToken)(token)._id;
                next();
            }
            else
                res.status(401).json((0, responseTypes_1.resTypes)(401));
        }
    });
}
exports.isCustomer = isCustomer;
function isAdmin(req, res, next) {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1];
        if ((0, jwt_1.verifyToken)(token) && model_1.default.isAdmin((0, jwt_1.verifyToken)(token)._id))
            next();
        else
            res.status(401).json(responseTypes_1.resTypes[401]);
    }
}
exports.isAdmin = isAdmin;
function isCan(req, res, next) {
    var _a;
    if (((_a = req.body["user"]) === null || _a === void 0 ? void 0 : _a.type) === "stuff") {
        const module = req["baseUrl"].split("/")[2].charAt(0).toUpperCase() +
            req["baseUrl"].split("/")[2].slice(1);
        (0, isCan_1.isPremit)(req.body["user"], module, req.method, req["originalUrl"])
            ? next()
            : res.status(401).json(responseTypes_1.resTypes[401]);
    }
    else
        next();
}
exports.isCan = isCan;
