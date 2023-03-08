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
exports.updateFiles = exports.resetPassword = exports.validateResetCode = exports.getResetCode = exports.getInfo = exports.updateInfo = exports.register = exports.login = void 0;
const model_1 = __importDefault(require("../modules/User/model"));
const jwt_1 = require("../helpers/jwt");
const responseTypes_1 = require("../helpers/responseTypes");
const repo_1 = require("../modules/User/repo");
const encrypt_1 = require("../utilities/encrypt");
const validate_1 = require("../modules/User/validate");
const upload_1 = __importDefault(require("../helpers/upload"));
const fs_1 = __importDefault(require("fs"));
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield model_1.default.isExist(req.body.auth);
        if (req.body.auth &&
            req.body.auth.length > 2 &&
            user &&
            (yield user.authenticate(req.body.password))) {
            res.status(200).json((0, responseTypes_1.resTypes)(200, {
                customer: Object.assign(Object.assign({}, user.info()), { token: (0, jwt_1.generateToken)({
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
                        value: "auth or password not correct",
                    },
                ],
            }));
        }
    });
}
exports.login = login;
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, validate_1.isValidAppUsersTypes)(req.body.type, res) &&
            (0, validate_1.validateConsultant)(req.body, res) &&
            (0, validate_1.validateCustomer)(req.body, res)) {
            let customer = yield (0, repo_1.create)(req.body);
            if (customer.success) {
                try {
                    res.json((0, responseTypes_1.resTypes)(200, {
                        record: Object.assign(Object.assign({}, customer.record.info()), { token: customer.record.token() }),
                    }));
                }
                catch (err) {
                    console.log("error", err);
                    res
                        .status(customer.code)
                        .json((0, responseTypes_1.resTypes)(customer.code, { errors: customer.errors }));
                }
            }
            else
                res
                    .status(customer.code)
                    .json((0, responseTypes_1.resTypes)(customer.code, { errors: customer.errors }));
        }
    });
}
exports.register = register;
function updateInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((0, validate_1.isValidAppUsersTypes)(req.body.type, res)) {
            const customer = yield (0, repo_1.update)(req.body.user._id, req.body);
            if (customer.success)
                res.json((0, responseTypes_1.resTypes)(201, {
                    record: Object.assign(Object.assign({}, customer.record.info()), { token: customer.record.token() }),
                }));
            else
                res
                    .status(customer.code)
                    .json((0, responseTypes_1.resTypes)(customer.code, { errors: customer.errors }));
        }
    });
}
exports.updateInfo = updateInfo;
function getInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield (0, repo_1.get)(req.body.user._id);
        if (customer.success) {
            res.json((0, responseTypes_1.resTypes)(200, {
                record: Object.assign(Object.assign({}, customer.record.info()), { token: customer.record.token() }),
            }));
        }
        else
            res
                .status(customer.code)
                .json((0, responseTypes_1.resTypes)(customer.code, { errors: customer.errors }));
    });
}
exports.getInfo = getInfo;
function getResetCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield model_1.default.isExist(req.body.auth);
        if (customer) {
            const resetCode = (0, encrypt_1.makeId)(5);
            customer.resetCode = resetCode;
            yield customer.save();
            res.json((0, responseTypes_1.resTypes)(200, {
                record: Object.assign(Object.assign({}, customer.info()), { token: customer.token() }),
                resetCode,
            }));
        }
        else
            res.status(400).json((0, responseTypes_1.resTypes)(404));
    });
}
exports.getResetCode = getResetCode;
function validateResetCode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield model_1.default.isExist(req.body.auth);
        if (customer && customer.resetCode === req.body.resetCode) {
            res.json((0, responseTypes_1.resTypes)(200, {
                message: "Reset code is correct, you can now reset password",
            }));
        }
        else
            res.status(400).json((0, responseTypes_1.resTypes)(400, {
                errors: {
                    key: "resetCode",
                    message: "reset code not valid",
                },
            }));
    });
}
exports.validateResetCode = validateResetCode;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield model_1.default.isExist(req.body.auth);
        if (customer && customer.resetCode === req.body.resetCode) {
            req.body.password
                ? (customer.hashedPassword = yield (0, encrypt_1.encrypt)(req.body.password))
                : res.status(400).json((0, responseTypes_1.resTypes)(400, {
                    errors: {
                        key: "password",
                        message: "password not valid",
                    },
                }));
            customer
                .save()
                .then(() => res.json((0, responseTypes_1.resTypes)(200, {
                message: "password reseted successfully",
            })))
                .catch((errors) => res.status(400).json((0, responseTypes_1.resTypes)(400, {
                errors,
            })));
        }
        else
            res.status(400).json((0, responseTypes_1.resTypes)(400, {
                errors: {
                    key: "resetCode",
                    message: "reset code not valid",
                },
            }));
    });
}
exports.resetPassword = resetPassword;
function updateFiles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = yield (0, repo_1.get)(req.body.user._id);
        if (customer.success) {
            (0, upload_1.default)(`users/${customer.record.username}`).parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log(err);
                }
                const params = [
                    "cover",
                    "avatar",
                    "professionCertificate",
                    "commercialRegister",
                    "taxCard",
                ];
                params.map((param) => {
                    if (files[param]) {
                        // delete old file
                        if (customer.record[param]) {
                            try {
                                fs_1.default.unlinkSync(`./${customer.record[param]}`);
                            }
                            catch (err) {
                                console.log("can't remove file", err);
                            }
                        }
                        customer.record[param] = files[param].path;
                    }
                });
                yield customer.record.save();
                res.json((0, responseTypes_1.resTypes)(201, {
                    record: Object.assign(Object.assign({}, customer.record.info()), { token: customer.record.token() }),
                }));
            }));
        }
        else
            res.status(400).json((0, responseTypes_1.resTypes)(404));
    });
}
exports.updateFiles = updateFiles;
