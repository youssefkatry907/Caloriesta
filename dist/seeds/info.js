"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("../modules/Info/model"));
function createInfo() {
    model_1.default.create({
        name: {
            en: "Caloriesta",
            ar: "تطبيق كالورستا",
        },
        description: {
            en: "Caloriesta",
            ar: "تطبيق كالورستا",
        },
        keeywords: {
            en: "Caloriesta",
            ar: "تطبيق كالورستا",
        },
        social: {
            facebook: "facebook",
            twitter: "twitter",
            tiktok: "tiktok",
            youtube: "youtube",
            snapChat: "snapChat",
            instagram: "instagram",
        },
        analysis: {
            hotjar: "",
            facebookPixel: "",
            googleAnalytical: "",
        },
        phone: "+201155490824",
        commissions: [
            {
                from: 0,
                to: 100,
                type: "fixed",
                value: 10,
            },
            {
                from: 100,
                to: 500,
                type: "ratio",
                value: 3,
            },
        ],
    }).then(() => console.log("Info has been created"));
}
createInfo();
