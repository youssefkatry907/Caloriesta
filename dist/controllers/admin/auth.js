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
exports.creatAdmin = exports.login = void 0;
const model_1 = __importDefault(require("../../modules/User/model"));
const jwt_1 = require("../../helpers/jwt");
const responseTypes_1 = require("../../helpers/responseTypes");
const repo_1 = require("../../modules/User/repo");
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield model_1.default.isExist(req.body.auth);
        if (user && (yield user.authenticate(req.body.password))) {
            res.status(200).json((0, responseTypes_1.resTypes)(200, {
                admin: Object.assign(Object.assign({}, user.info()), { token: (0, jwt_1.generateToken)({
                        _id: user._id,
                        email: user.email,
                        type: user.type,
                        role: user.role,
                    }) }),
            }));
        }
        else {
            res.status(401).json((0, responseTypes_1.resTypes)(401, {
                errors: [
                    {
                        key: "error",
                        value: "email or password not correct",
                    },
                ],
            }));
        }
    });
}
exports.login = login;
function creatAdmin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let admin = yield (0, repo_1.create)(req.body);
        console.log("new Aadmin", admin);
        if (admin.record) {
            admin.record
                .save()
                .then(() => res.json((0, responseTypes_1.resTypes)(200)))
                .catch((err) => {
                console.log("err", err);
                res.json((0, responseTypes_1.resTypes)(400, { errors: err }));
            });
        }
        else
            res.json((0, responseTypes_1.resTypes)(400, { errors: admin.errors }));
    });
}
exports.creatAdmin = creatAdmin;
