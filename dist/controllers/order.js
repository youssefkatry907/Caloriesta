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
exports.createOrder = exports.getUserOrders = void 0;
const responseTypes_1 = require("../helpers/responseTypes");
const model_1 = __importDefault(require("../modules/Cart/model"));
const model_2 = __importDefault(require("../modules/Order/model"));
function getUserOrders(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const order = yield model_2.default.findOne({
                user: req["user"],
                _id: req.params.id,
            }).populate({
                path: "cart.items.product",
                select: "name image",
            });
            res.json((0, responseTypes_1.resTypes)(200, {
                record: order,
            }));
        }
        else {
            const orders = yield model_2.default.find({
                user: req["user"],
            }).populate({
                path: "cart.items.product",
                select: "name image",
            });
            res.json((0, responseTypes_1.resTypes)(200, {
                records: orders,
            }));
        }
    });
}
exports.getUserOrders = getUserOrders;
function createOrder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentCart = yield model_1.default.findOne({
            user: req["user"],
            isLocked: false,
        });
        if (currentCart) {
            const order = new model_2.default({
                cart: currentCart._id,
                user: currentCart.user,
                resturant: currentCart.resturant,
                total: currentCart.total,
                shippingAddress: req.body.shippingAddress,
                payment: "visa",
                status: 1,
            });
            yield order.save();
            currentCart.isLocked = true;
            yield currentCart.save();
            res.json((0, responseTypes_1.resTypes)(201, {
                record: order,
                message: "order has been cerated",
            }));
        }
        else {
            res.json((0, responseTypes_1.resTypes)(404, {
                message: "user not having any cart",
            }));
        }
    });
}
exports.createOrder = createOrder;
