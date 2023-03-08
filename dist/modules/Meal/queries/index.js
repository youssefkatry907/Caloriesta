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
const category_1 = __importDefault(require("./category"));
const name_1 = __importDefault(require("./name"));
const price_1 = __importDefault(require("./price"));
const rate_1 = __importDefault(require("./rate"));
const calories_1 = __importDefault(require("./calories"));
const type_1 = __importDefault(require("./type"));
const discount_1 = __importDefault(require("./discount"));
const resturant_1 = __importDefault(require("./resturant"));
function queriesCollection(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let queriesArr = [];
        let queriesObj = {};
        if ((0, type_1.default)(req)) {
            queriesArr.push((0, type_1.default)(req));
            queriesObj[Object.keys((0, type_1.default)(req))[0]] =
                (0, type_1.default)(req)[Object.keys((0, type_1.default)(req))[0]];
        }
        if ((0, discount_1.default)(req)) {
            queriesArr.push((0, discount_1.default)(req));
            queriesObj[Object.keys((0, discount_1.default)(req))[0]] =
                (0, discount_1.default)(req)[Object.keys((0, discount_1.default)(req))[0]];
        }
        if ((0, category_1.default)(req) && (yield (0, category_1.default)(req))) {
            let q = yield (0, category_1.default)(req);
            queriesArr.push(q);
            queriesObj[Object.keys(q)[0]] = q[Object.keys(q)[0]];
        }
        if ((0, name_1.default)(req)) {
            queriesArr.push((0, name_1.default)(req));
            queriesObj[Object.keys((0, name_1.default)(req))[0]] =
                (0, name_1.default)(req)[Object.keys((0, name_1.default)(req))[0]];
        }
        if ((0, price_1.default)(req)) {
            queriesArr.push((0, price_1.default)(req));
            queriesObj[Object.keys((0, price_1.default)(req))[0]] =
                (0, price_1.default)(req)[Object.keys((0, price_1.default)(req))[0]];
        }
        if ((0, calories_1.default)(req)) {
            queriesArr.push((0, calories_1.default)(req));
            queriesObj[Object.keys((0, calories_1.default)(req))[0]] =
                (0, calories_1.default)(req)[Object.keys((0, calories_1.default)(req))[0]];
        }
        if ((0, rate_1.default)(req)) {
            queriesArr.push((0, rate_1.default)(req));
            queriesObj[Object.keys((0, rate_1.default)(req))[0]] =
                (0, rate_1.default)(req)[Object.keys((0, rate_1.default)(req))[0]];
        }
        if ((0, resturant_1.default)(req)) {
            queriesArr.push((0, resturant_1.default)(req));
            queriesObj[Object.keys((0, resturant_1.default)(req))[0]] =
                (0, resturant_1.default)(req)[Object.keys((0, resturant_1.default)(req))[0]];
        }
        return { queriesArr, queriesObj };
    });
}
exports.default = queriesCollection;
