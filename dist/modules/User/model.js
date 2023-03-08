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
exports.userSchema = void 0;
const mongo_1 = __importDefault(require("../../database/mongo"));
const encrypt_1 = require("../../utilities/encrypt");
const genSlug_1 = require("../../helpers/genSlug");
const jwt_1 = require("../../helpers/jwt");
exports.userSchema = new mongo_1.default.Schema({
    gender: { type: String, default: "male", enum: ["male", "female"] },
    isActive: { type: Boolean, default: true },
    isTop: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    fullName: { type: String, required: true },
    bio: { type: String, required: false },
    code: { type: String, required: false },
    yearsOfExperience: { type: Number, required: false, default: 0 },
    consultantPrice: { type: Number, required: false, default: 0 },
    username: { type: String, required: false },
    resetCode: { type: String, required: false },
    avatar: { type: String, required: false },
    cover: { type: String, required: false },
    nationalId: { type: String, required: false },
    addresses: [Object],
    programmes: [{ type: mongo_1.default.SchemaTypes.ObjectId, ref: "Programme" }],
    professionCertificate: {
        type: String,
        required: false,
    },
    commercialRegister: {
        type: String,
        required: false,
    },
    taxCard: {
        type: String,
        required: false,
    },
    hashedPassword: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rate: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
    rates: [
        {
            user: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "User", required: false },
            rate: Number,
            comment: String,
        },
    ],
    home: {
        city: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "City", required: true },
        region: { type: String, required: false },
        location: { lat: Number, lng: Number },
        address: String,
    },
    type: {
        type: String,
        enum: [
            "customer",
            "nutrition",
            "fitness",
            "resturant",
            "stuff",
            "admin",
            "delivery",
        ],
    },
    role: { name: String, roles: [] },
    industry: {
        type: mongo_1.default.SchemaTypes.ObjectId,
        ref: "Industry",
        required: false,
    },
    sliders: [
        {
            cover: {
                ar: String,
                en: String,
            },
            onlyCover: { type: Boolean, default: true },
            item: { type: mongo_1.default.SchemaTypes.ObjectId, ref: "Meal", required: false },
        },
    ],
}, {
    timestamps: true,
});
// Info - white label properties
exports.userSchema.methods.info = function () {
    return {
        _id: this._id,
        fullName: this.fullName,
        username: this.username,
        bio: this.bio,
        email: this.email,
        phone: this.phone,
        isActive: this.isActive,
        isVerified: this.isVerified,
        isTop: this.isTop,
        rate: this.rate,
        rates: this.rates,
        gender: this.gender,
        home: this.home,
        addresses: this.addresses,
        role: this.role,
        type: this.type,
        industry: this.industry,
        consultantPrice: this.consultantPrice,
        yearsOfExperience: this.yearsOfExperience,
        programmes: this.programmes,
        avatar: this.avatar,
        cover: this.cover,
        professionCertificate: this.professionCertificate,
        commercialRegister: this.commercialRegister,
        taxCard: this.taxCard,
    };
};
// Token - white label properties
exports.userSchema.methods.token = function () {
    const token = (0, jwt_1.generateToken)({
        _id: this._id,
        email: this.email,
        type: this.type,
        role: this.role,
    });
    return token;
};
// auth
exports.userSchema.methods.authenticate = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, encrypt_1.compare)(password, this.hashedPassword);
    });
};
// generateCode
exports.userSchema.methods.generateCode = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield mongo_1.default.models["User"].countDocuments();
        if (this.home["city"] && this.home["region"]) {
            let city = yield mongo_1.default.models["City"].findOne({ _id: this.home.city });
            let region = yield mongo_1.default.models["Region"].findOne({ _id: this.home.region });
            return (0, genSlug_1.genSlug)(city.name, region.name, count);
        }
    });
};
// isExist auth is ( email | phone | username )
exports.userSchema.statics.isExist = function (auth) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.default.models["User"].findOne({
            $or: [
                { email: (_a = auth === null || auth === void 0 ? void 0 : auth.trim()) === null || _a === void 0 ? void 0 : _a.toLowerCase() },
                { phone: (_b = auth === null || auth === void 0 ? void 0 : auth.trim()) === null || _b === void 0 ? void 0 : _b.toLowerCase() },
                { username: (_c = auth === null || auth === void 0 ? void 0 : auth.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase() },
            ],
        });
    });
};
exports.userSchema.statics.random = function (query) {
    return __awaiter(this, void 0, void 0, function* () {
        const count = yield this.count();
        const rand = Math.floor(Math.random() * count);
        const randomDoc = yield this.find(query).skip(rand);
        return randomDoc;
    });
};
// isExist auth is ( auth | password )
exports.userSchema.statics.login = function (auth, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield mongo_1.default.models["User"].findOne({
            $or: [
                { email: auth.trim().toLowerCase() },
                { phone: auth.trim().toLowerCase() },
                { username: auth.trim().toLowerCase() },
            ],
        });
        if (user) {
            const result = yield user.authenticate(password, user.hashedPassword);
            return result ? user.info() : null;
        }
        else
            return null;
    });
};
// isExist auth is ( email | phone )
exports.userSchema.statics.isAdmin = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.default.models["User"].findOne({
            _id: id,
            type: "admin",
        });
    });
};
// isExist auth is ( email | phone )
exports.userSchema.statics.isStaff = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.default.models["User"].findOne({
            _id: id,
            type: "stuff",
        });
    });
};
exports.userSchema.statics.isConsultant = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.default.models["User"].findOne({
            _id: id,
            type: "consultant",
        });
    });
};
exports.userSchema.statics.isCustomer = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return mongo_1.default.models["User"].findOne({
            _id: id,
            type: "customer",
        });
    });
};
// userSchema.pre<IUser>("save", async function (next) {
//   if (this.type !== "stuff" && this.type !== "admin") {
//     this.code = await this.generateCode();
//     this.username = handleUsername(this.username);
//   }
//   return next();
// });
exports.default = mongo_1.default.model("User", exports.userSchema);
