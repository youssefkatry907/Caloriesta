"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrice = void 0;
function handlePrice(form) {
    if (form.discount &&
        form.discount.type != "noDiscount" &&
        form.discount.value > 0) {
        const value = form.discount.type == "fixed"
            ? form.discount.value
            : (form.price * form.discount.value) / 100;
        form.finalPrice = form.price - value;
    }
    else
        form.finalPrice = form.price;
    return form;
}
exports.handlePrice = handlePrice;
