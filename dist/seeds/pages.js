"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("../modules/Page/model"));
function createPage() {
    model_1.default.create({
        about: {
            en: "about",
            ar: "عن التطبيق",
        },
        privacy: {
            en: "Privacy",
            ar: "سياسة الخصوصية",
        },
        conditions: {
            en: "Condetions and terms",
            ar: "شروط الاستخدام",
        },
    }).then(() => console.log("Page has been created"));
}
createPage();
