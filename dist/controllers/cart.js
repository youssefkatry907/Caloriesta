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
exports.updateItemQuantity = exports.validateCoupon = exports.updatItemQuantity = exports.flushUserCart = exports.removeItem = exports.addItem = exports.getUserCart = void 0;
const responseTypes_1 = require("../helpers/responseTypes");
const repo_1 = require("../modules/Cart/repo");
const model_1 = __importDefault(require("../modules/Cart/model"));
const model_2 = __importDefault(require("../modules/Meal/model"));
const model_3 = __importDefault(require("../modules/Coupon/model"));
function getUserCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cart = yield model_1.default.findOne({
            user: req["user"],
            isLocked: false,
        }).populate({
            path: "items.product resturant",
            select: "name image type avatar fullName calories quantity price finalPrice discount",
        });
        if (cart) {
            res.status(200).json((0, responseTypes_1.resTypes)(200, {
                cart: {
                    _id: cart._id,
                    user: cart.user,
                    resturant: cart.resturant,
                    items: cart.items,
                    total: cart.total,
                    isLocked: cart.isLocked,
                    financial: cart.financial,
                },
            }));
        }
        else {
            const result = yield (0, repo_1.create)({
                user: req["user"],
            });
            if (result.success) {
                res.status(201).json((0, responseTypes_1.resTypes)(201, {
                    cart: {
                        _id: result.record._id,
                        user: result.record.user,
                        isLocked: result.record.isLocked,
                        items: result.record.items,
                        financial: cart.financial,
                    },
                }));
            }
            else {
                console.log(result.errors);
                res.status(400).json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
            }
        }
    });
}
exports.getUserCart = getUserCart;
function addItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * {
         * product: ObjectId
         * quantity: number
         * option: objectId if exist
         * addon: objectId if exist
         * }
         */
        const cart = yield (0, repo_1.get)(req.params.id);
        if (cart.success) {
            // check if products exist
            const product = yield model_2.default.findOne({
                _id: req.body.product,
            });
            if (product) {
                /**
                 * check if item exist
                 * if exist check if same option
                 * if same option update item
                 * if not same add as new item
                 */
                if ((cart.record.items.length &&
                    product.resturant.toString() ==
                        cart.record.resturant["_id"].toString()) ||
                    !cart.record.items.length) {
                    let targetProducts = cart.record.items.filter((item) => { var _a, _b; return ((_b = (_a = item.product) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) == req.body.product.toString(); });
                    if (targetProducts.length) {
                        yield handleExistItem(req, res, cart, targetProducts, product);
                    }
                    else {
                        yield saveNewItem(req, res, cart, product);
                    }
                }
                else {
                    res.status(409).json((0, responseTypes_1.resTypes)(409, {
                        message: `Can't add item from another resturant`,
                    }));
                }
            }
            else {
                res.status(404).json((0, responseTypes_1.resTypes)(404, {
                    message: `prodcut not found`,
                }));
            }
        }
        else {
            res.status(404).json((0, responseTypes_1.resTypes)(404, {
                message: `cart not found`,
            }));
        }
    });
}
exports.addItem = addItem;
function removeItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cart = yield (0, repo_1.get)(req.params.id);
        if (cart.success) {
            // check if product exist
            let target = cart.record.items.find((record) => { var _a; return ((_a = record._id) === null || _a === void 0 ? void 0 : _a.toString()) == req.body.itemId; });
            if (target) {
                cart.record.items = cart.record.items.filter((item) => item._id.toString() != req.body.itemId);
                cart.record.total = cart.record.items.reduce((total = 0, item) => (total += item.total), 0);
                yield cart.record.save();
                res.status(200).json((0, responseTypes_1.resTypes)(200, {
                    cart: cart.record,
                    message: `item has been removed from cart`,
                }));
            }
            else {
                res.status(404).json((0, responseTypes_1.resTypes)(404, {
                    message: `item not found in cart`,
                }));
            }
        }
        else {
            res.status(404).json((0, responseTypes_1.resTypes)(404, {
                message: `cart not found`,
            }));
        }
    });
}
exports.removeItem = removeItem;
function flushUserCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cart = yield (0, repo_1.get)(req.params.id);
        if (cart.success) {
            cart.record.items = [];
            cart.record.coupon = null;
            cart.record.resturant = null;
            cart.record.total = 0;
            cart.record.financial = {
                paymentFees: 0,
                deliveryFees: 0,
                couponDiscount: 0,
                totalItemsCost: 0,
            };
            yield cart.record.save();
            res.json((0, responseTypes_1.resTypes)(200, {
                cart: cart.record,
                message: "Cart has been flushed",
            }));
        }
        else {
            res.status(404).json((0, responseTypes_1.resTypes)(404, {
                message: `cart not found`,
            }));
        }
    });
}
exports.flushUserCart = flushUserCart;
function saveNewItem(req, res, cart, product) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let finalQuanttiy = (_a = req.body.quantity) !== null && _a !== void 0 ? _a : 1;
        let finalPrice = req.body.option &&
            ((_b = product.options) === null || _b === void 0 ? void 0 : _b.find((option) => option._id.toString() == req.body.option))
            ? Number(product.options.find((option) => option._id.toString() == req.body.option).price)
            : Number(product.finalPrice);
        let finalAddons = [];
        if (req.body.addons && req.body.addons.length) {
            const addons = (_c = product.addons) === null || _c === void 0 ? void 0 : _c.filter((addon) => req.body.addons.includes(addon._id.toString()));
            finalPrice += addons.reduce((total = 0, addon) => (total += addon.price), 0);
            finalAddons = addons;
        }
        let newCartItem = {
            product: product._id,
            quantity: finalQuanttiy,
            price: finalPrice,
            total: Number(finalQuanttiy) * finalPrice,
            resturant: product.resturant,
        };
        if (req.body.option) {
            const option = product.options.find((option) => option._id.toString() == req.body.option);
            newCartItem["option"] = {
                optionId: option._id,
                name: option.name,
                price: option.price,
            };
        }
        if (finalAddons && finalAddons.length)
            newCartItem["addons"] = finalAddons;
        cart.record.resturant = product.resturant;
        cart.record.items.push(newCartItem);
        cart.record.items.find((item) => { var _a; return item.product.toString() == ((_a = product._id) === null || _a === void 0 ? void 0 : _a.toString()); }).product = {
            _id: product._id,
            name: product.name,
            image: product.image,
        };
        const cartAfterCalcs = yield cartCalcs(cart.record);
        yield cartAfterCalcs.save();
        const updatedCard = yield (0, repo_1.get)(cartAfterCalcs._id);
        res.status(201).json((0, responseTypes_1.resTypes)(201, {
            cart: updatedCard,
            message: `item has been added to cart`,
        }));
    });
}
function handleExistItem(req, res, cart, targetProducts, product) {
    return __awaiter(this, void 0, void 0, function* () {
        //  same item
        const targetProduct = getTargetItem(req, targetProducts);
        if (targetProduct) {
            let finalQuantity = Number(targetProduct.quantity) + 1;
            targetProduct.quantity = finalQuantity;
            targetProduct.total = Number(targetProduct.price) * finalQuantity;
            const cartAfterCalcs = yield cartCalcs(cart.record);
            yield cartAfterCalcs.save();
            res.status(200).json((0, responseTypes_1.resTypes)(200, {
                cart: cartAfterCalcs,
                message: `item quantity has been updated`,
            }));
        }
        else {
            yield saveNewItem(req, res, cart, product);
        }
    });
}
function getTargetItem(req, targetProducts) {
    return req.body.option
        ? targetProducts.find((pro) => { var _a, _b; return ((_b = (_a = pro.option) === null || _a === void 0 ? void 0 : _a.optionId) === null || _b === void 0 ? void 0 : _b.toString()) == req.body.option; })
        : targetProducts.find((pro) => {
            var _a;
            return ((_a = pro.product) === null || _a === void 0 ? void 0 : _a._id.toString()) == req.body.product &&
                pro.option == undefined;
        });
}
function updatItemQuantity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cart = yield (0, repo_1.get)(req.params.id);
        if (cart.success) {
            const item = cart.record.items.find((item) => item._id == req.body.itemId);
            if (item) {
                let finalQuantity = req.body.quantity && req.body.quantity > 0
                    ? Number(req.body.quantity)
                    : Number(item.quantity) + 1;
                item.quantity = finalQuantity;
                item.total = Number(item.price) * finalQuantity;
                const cartAfterCalcs = yield cartCalcs(cart.record);
                yield cartAfterCalcs.save();
                res.json((0, responseTypes_1.resTypes)(200, {
                    message: "item has been updated",
                    cart: cartAfterCalcs,
                }));
            }
            else
                res.status(404).json((0, responseTypes_1.resTypes)(404));
        }
        else
            res.status(404).json((0, responseTypes_1.resTypes)(404));
    });
}
exports.updatItemQuantity = updatItemQuantity;
function validateCoupon(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const coupon = yield model_3.default.findOne({
            code: req.body.coupon,
        });
        const currentCart = yield model_1.default.findOne({
            user: req["user"],
            isLocked: false,
        }).populate({
            path: "items.product",
            select: "name gallaries slug",
        });
        if (coupon &&
            coupon.isActive &&
            (new Date(coupon.endDate) > new Date()) &&
            (new Date(coupon.startDate) <= new Date()) &&
            (currentCart.total >= coupon["minOrder"])) {
            if (!currentCart.coupon) {
                currentCart["coupon"] = coupon._id;
                coupon["count"] += 1;
                const cartAfterCalcs = yield cartCalcs(currentCart);
                yield coupon.save();
                yield cartAfterCalcs.save();
                res.json((0, responseTypes_1.resTypes)(200, {
                    cart: cartAfterCalcs,
                    message: "code is ok",
                }));
            }
            else {
                res.status(400).json((0, responseTypes_1.resTypes)(400, {
                    message: "this cart already have a coupon",
                }));
            }
        }
        else {
            res.status(400).json((0, responseTypes_1.resTypes)(400, {
                message: "Coupon not valid",
            }));
        }
    });
}
exports.validateCoupon = validateCoupon;
function updateItemQuantity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * {
         * product: ObjectId
         * quantity: number
         * option: objectId if exist
         * addon: objectId if exist
         * }
         */
        const cart = yield (0, repo_1.get)(req.params.id);
        if (cart.success) {
            let targetProduct = cart.record.items.find((item) => item._id.toString() == req.body.itemId.toString());
            let finalQuantity = 1;
            if (req.body.type == "plus" &&
                targetProduct.product.quantity < targetProduct.quantity + 1) {
                res.status(400).json((0, responseTypes_1.resTypes)(400, {
                    message: "Item has reached to maximum quantity",
                }));
            }
            else if (req.body.type == "plus" && 0 == targetProduct.quantity - 1) {
                res.status(400).json((0, responseTypes_1.resTypes)(400, {
                    message: "Item cann't be less than zero",
                }));
            }
            else {
                finalQuantity =
                    req.body.type == "plus"
                        ? targetProduct.quantity + 1
                        : targetProduct.quantity - 1;
                targetProduct.quantity = finalQuantity;
                targetProduct.total = Number(targetProduct.price) * finalQuantity;
                const cartAfterCalcs = yield cartCalcs(cart.record);
                yield cartAfterCalcs.save();
                res.status(200).json((0, responseTypes_1.resTypes)(200, {
                    cart: cartAfterCalcs,
                    message: `item has been updated`,
                }));
            }
        }
        else {
            res.status(404).json((0, responseTypes_1.resTypes)(404, {
                message: `cart not found`,
            }));
        }
    });
}
exports.updateItemQuantity = updateItemQuantity;
function cartCalcs(cart) {
    return __awaiter(this, void 0, void 0, function* () {
        cart.financial["taxFees"] = 0;
        cart.financial["paymentFees"] = 0;
        cart.financial["deliveryFees"] = 0;
        cart.financial["couponDiscount"] = 0;
        cart.financial["totalItemsCost"] = cart.items.reduce((total = 0, item) => (total += Number(item.total)), 0);
        if (cart.coupon) {
            const coupon = yield model_3.default.findOne({ _id: cart.coupon });
            const discountValue = coupon.discountType == "fixed"
                ? coupon.discount
                : (coupon.discount / cart.financial["totalItemsCost"]) * 100;
            cart.financial["couponDiscount"] = discountValue;
        }
        cart.total =
            Number(cart.financial["totalItemsCost"]) -
                Number(cart.financial["couponDiscount"]) +
                Number(cart.financial["deliveryFees"]) +
                Number(cart.financial["taxFees"]) +
                Number(cart.financial["paymentFees"]);
        return cart;
    });
}
