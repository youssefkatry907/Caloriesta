"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../database/mongo"));
const Info = new mongo_1.default.Schema({
    name: {
        ar: String,
        en: String,
    },
    description: {
        ar: String,
        en: String,
    },
    keywords: {
        ar: String,
        en: String,
    },
    logoAr: String,
    logoEn: String,
    favico: String,
    social: {
        facebook: String,
        twitter: String,
        youtube: String,
        instagram: String,
        tiktok: String,
        snapChat: String,
    },
    analysis: {
        hotjar: String,
        facebookPixel: String,
        googleAnalytical: String,
    },
    verification: {
        wot: String,
        facebook: String,
        googleTag: String,
    },
    chat: {
        whatsapp: String,
        messenger: String,
    },
    phone: String,
    email: String,
    password: String,
    commissions: [
        {
            from: { type: Number, default: 0 },
            to: { type: Number, default: 0 },
            type: { type: String, enum: ["ratio", "fixed"] },
            value: Number,
        },
    ],
}, {
    timestamps: true,
});
// Info - white label properties
Info.methods.info = function () {
    return {
        _id: this._id,
        name: this.name,
        description: this.description,
        keywords: this.keywords,
        email: this.email,
        phone: this.phone,
        social: this.social,
        analysis: this.analysis,
        verification: this.verification,
        chat: this.chat,
        commissions: this.commissions,
    };
};
exports.default = mongo_1.default.model("Info", Info);
