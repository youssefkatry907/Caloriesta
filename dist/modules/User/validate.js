"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAppUsersTypes = exports.validateConsultant = exports.validateCustomer = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
function validateCustomer(payload, res) {
    let errors = [];
    if (!payload.email ||
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(payload.email)) {
        errors.push({
            key: "email",
            value: "email not exist or not valid",
        });
    }
    if (!payload.password ||
        payload.password.length < 4 ||
        payload.password.length > 20) {
        errors.push({
            key: "password",
            value: "password must between 4-20 words and digits",
        });
    }
    if (!payload.fullName ||
        payload.fullName.length < 4 ||
        payload.fullName.length > 30) {
        errors.push({
            key: "fullName",
            value: "fullName must between 4-30 words",
        });
    }
    if (!payload.phone) {
        errors.push({
            key: "phone",
            value: "phone must exist",
        });
    }
    if (!payload.home || !payload.home.city || !payload.home.region) {
        errors.push({
            key: "home",
            value: "home with city and region must exist",
        });
    }
    if (!payload.username ||
        payload.username.length > 15 ||
        payload.username.length < 4) {
        errors.push({
            key: "username",
            value: "username must be between 4 - 15 letters",
        });
    }
    return errors.length
        ? res.status(400).json((0, responseTypes_1.resTypes)(400, {
            errors,
        }))
        : true;
}
exports.validateCustomer = validateCustomer;
function validateConsultant(data, res) {
    if (["nutrition", "fitness"].includes(data.type)) {
        let errors = [];
        if (!data.yearsOfExperience || data.yearsOfExperience < 1)
            errors.push({
                key: "yearsOfExperience",
                message: "yearsOfExperience must exist and be more than 1",
            });
        if (!data.industry)
            errors.push({
                key: "industry",
                message: "industry must exist for consultant user",
            });
        if (errors.length) {
            res.status(400).json((0, responseTypes_1.resTypes)(400, {
                errors,
            }));
        }
        else
            return true;
    }
    else
        return true;
}
exports.validateConsultant = validateConsultant;
function isValidAppUsersTypes(data, res) {
    if (![
        "customer",
        "nutrition",
        "fitness",
        "resturant",
        "stuff",
        "delivery",
    ].includes(data))
        res.status(400).json((0, responseTypes_1.resTypes)(400, {
            errors: {
                key: "type",
                message: "type not valid it must one of customer, nutrition, fitness, resturant ",
            },
        }));
    else
        return true;
}
exports.isValidAppUsersTypes = isValidAppUsersTypes;
