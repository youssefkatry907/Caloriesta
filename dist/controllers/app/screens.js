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
exports.consultants = exports.restaurants = exports.packages = exports.mealsScreen = exports.home = void 0;
const model_1 = __importDefault(require("../../modules/Meal/model"));
const repo_1 = require("../../modules/Package/repo");
const repo_2 = require("../../modules/Meal/repo");
const repo_3 = require("../../modules/User/repo");
const responseTypes_1 = require("../../helpers/responseTypes");
function home(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const packages = yield (0, repo_1.list)({ "cities.city": req.body.city._id });
        let handledPackages = [];
        yield Promise.all([
            packages.map((pkg) => {
                var _a, _b, _c, _d, _e, _f;
                pkg.wallet = pkg.price = (_a = pkg.cities) === null || _a === void 0 ? void 0 : _a.find((city) => { var _a; return ((_a = city === null || city === void 0 ? void 0 : city.city) === null || _a === void 0 ? void 0 : _a.code) == req.body.city.code; }).price;
                pkg.currency = (_d = (_c = (_b = pkg.cities) === null || _b === void 0 ? void 0 : _b.find((city) => { var _a; return ((_a = city === null || city === void 0 ? void 0 : city.city) === null || _a === void 0 ? void 0 : _a.code) == req.body.city.code; }).city) === null || _c === void 0 ? void 0 : _c.currency) === null || _d === void 0 ? void 0 : _d.name;
                delete pkg.cities;
                handledPackages.push({
                    _id: pkg._id,
                    name: pkg.name,
                    code: pkg.code,
                    sort: pkg.sort,
                    details: pkg.details,
                    color: pkg.color,
                    wallet: (_e = pkg.cities) === null || _e === void 0 ? void 0 : _e.find((city) => { var _a; return ((_a = city === null || city === void 0 ? void 0 : city.city) === null || _a === void 0 ? void 0 : _a.code) == req.body.city.code; }).wallet,
                    price: (_f = pkg.cities) === null || _f === void 0 ? void 0 : _f.find((city) => { var _a; return ((_a = city === null || city === void 0 ? void 0 : city.city) === null || _a === void 0 ? void 0 : _a.code) == req.body.city.code; }).price,
                });
            }),
        ]);
        let consultQuery = {
            "home.city": req.body.city._id,
            isActive: true,
        };
        consultQuery["type"] = "nutrition";
        const nutritionConsultants = yield (0, repo_3.customQuery)(consultQuery, {
            from: "industries",
            as: "industry",
            let: { industryId: "$industry" },
            pipeline: [
                {
                    $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
                },
                {
                    $project: { name: 1, _id: 0 },
                },
            ],
        }, "$industry", {
            fullName: "$fullName",
            avatar: "$avatar",
            yearsOfExperience: "$yearsOfExperience",
            rate: "$rate",
            industry: "$industry",
            rates: { $size: { $ifNull: ["$rates", []] } },
        }, 12, { createdAt: -1 });
        consultQuery["type"] = { $in: ["nutrition", "fitness"] };
        consultQuery["isTop"] = true;
        const topConsultant = yield (0, repo_3.customQuery)(consultQuery, {
            from: "industries",
            as: "industry",
            let: { industryId: "$industry" },
            pipeline: [
                {
                    $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
                },
                {
                    $project: { name: 1, _id: 0 },
                },
            ],
        }, "$industry", {
            fullName: "$fullName",
            avatar: "$avatar",
            yearsOfExperience: "$yearsOfExperience",
            rate: "$rate",
            industry: "$industry",
            rates: { $size: { $ifNull: ["$rates", []] } },
        }, 12, { createdAt: -1 });
        consultQuery["type"] = "fitness";
        const fitnessConsultants = yield (0, repo_3.customQuery)(consultQuery, {
            from: "industries",
            as: "industry",
            let: { industryId: "$industry" },
            pipeline: [
                {
                    $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
                },
                {
                    $project: { name: 1, _id: 0 },
                },
            ],
        }, "$industry", {
            fullName: "$fullName",
            avatar: "$avatar",
            yearsOfExperience: "$yearsOfExperience",
            rate: "$rate",
            industry: "$industry",
            rates: { $size: { $ifNull: ["$rates", []] } },
        }, 12, { createdAt: -1 });
        // get resturants in same city
        const resturants = yield (0, repo_3.list)({
            type: "resturant",
            "home.city": req.body.city._id,
            isActive: true,
        }, "fullName avatar");
        let ids = resturants.map((resturant) => resturant._id);
        let defaultQuery = {
            resturant: { $in: ids },
            isActive: true,
        };
        const latestMeals = yield (0, repo_2.list)(defaultQuery, "image name calories resturant price discount finalPrice type rate quantity", {
            sort: { createdAt: -1 },
            limit: 12,
        });
        console.log(resturants[0]);
        res.json((0, responseTypes_1.resTypes)(200, {
            packages: handledPackages,
            latestMeals,
            nutritionConsultants,
            fitnessConsultants,
            resturants,
            topConsultant,
            currency: (_a = req.body.city.currency) === null || _a === void 0 ? void 0 : _a.name,
        }));
    });
}
exports.home = home;
function mealsScreen(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const result = yield model_1.default.findOne({ _id: req.params.id }, "image name description calories resturant price discount finalPrice type rate rates quantity addons options category").populate({
                path: "resturant rates.user category",
                select: "fullName avatar name",
            });
            if (result) {
                res.json((0, responseTypes_1.resTypes)(200, {
                    record: result,
                    currency: (_a = req.body.city.currency) === null || _a === void 0 ? void 0 : _a.name,
                }));
            }
            else
                res.json((0, responseTypes_1.resTypes)(400, { message: "meal not found" }));
        }
        else {
            // get resturants in same city
            const resturants = yield (0, repo_3.list)({
                type: "resturant",
                "home.city": req.body.city._id,
                isActive: true,
            }, "name");
            let ids = resturants.map((resturant) => resturant._id);
            let defaultQuery = {
                resturant: { $in: ids },
                isActive: true,
            };
            let offersQ = {
                resturant: { $in: ids },
                isActive: true,
                "discount.value": { $gte: 5 },
            };
            const offers = yield model_1.default.find(offersQ, "offerCover name calories resturant price discount finalPrice type rate quantity")
                .populate({ path: "resturant", select: "fullName" })
                .limit(25);
            const records = yield model_1.default.find(defaultQuery, "image name calories resturant price discount finalPrice type rate quantity category")
                .populate({ path: "resturant category", select: "fullName name" })
                .limit(50)
                .sort({ createdAt: -1 });
            res.json((0, responseTypes_1.resTypes)(200, {
                offers,
                records,
                currency: (_b = req.body.city.currency) === null || _b === void 0 ? void 0 : _b.name,
            }));
        }
    });
}
exports.mealsScreen = mealsScreen;
function packages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const result = yield (0, repo_1.get)(req.params.id);
            if (result.success) {
                res.json((0, responseTypes_1.resTypes)(200, { record: result.record }));
            }
            else
                res.json((0, responseTypes_1.resTypes)(400, { errors: result.errors }));
        }
        else {
            const records = yield (0, repo_1.list)();
            res.json((0, responseTypes_1.resTypes)(200, { records }));
        }
    });
}
exports.packages = packages;
function restaurants(req, res) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.id) {
            const restaurant = yield (0, repo_3.get)(req.params.id);
            let query = {
                resturant: restaurant.record._id,
                isActive: true,
            };
            const meals = yield model_1.default.find(query, "image name calories resturant price discount finalPrice type rate quantity category")
                .populate({ path: "resturant category", select: "fullName name" })
                .sort({ createdAt: -1 })
                .limit(25);
            res.json((0, responseTypes_1.resTypes)(200, {
                record: {
                    name: (_a = restaurant === null || restaurant === void 0 ? void 0 : restaurant.record) === null || _a === void 0 ? void 0 : _a.fullName,
                    avatar: (_b = restaurant === null || restaurant === void 0 ? void 0 : restaurant.record) === null || _b === void 0 ? void 0 : _b.avatar,
                    rate: (_c = restaurant === null || restaurant === void 0 ? void 0 : restaurant.record) === null || _c === void 0 ? void 0 : _c.rate,
                },
                sliders: (_d = restaurant.record.sliders) !== null && _d !== void 0 ? _d : [],
                meals,
            }));
        }
        else {
            let query = {
                type: "resturant",
                "home.city": req.body.city._id,
                isActive: true,
                rate: { $gte: 2 },
            };
            const featured = yield (0, repo_3.customQuery)(query, null, null, {
                fullName: "$fullName",
                avatar: "$avatar",
                cover: "$cover",
                rate: "$rate",
                rates: { $size: { $ifNull: ["$rates", []] } },
            }, 12, { createdAt: -1 });
            query["rate"] = { $gte: 0 };
            const records = yield (0, repo_3.customQuery)(query, null, null, {
                fullName: "$fullName",
                avatar: "$avatar",
                cover: "$cover",
                rate: "$rate",
                rates: { $size: { $ifNull: ["$rates", []] } },
            }, 50, { createdAt: -1 });
            res.json((0, responseTypes_1.resTypes)(200, { featured, records }));
        }
    });
}
exports.restaurants = restaurants;
function consultants(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = {
            type: { $in: ["nutrition", "fitness"] },
            "home.city": req.body.city._id,
            isActive: true,
            rate: { $gte: 2 },
        };
        const featured = yield (0, repo_3.customQuery)(query, {
            from: "industries",
            as: "industry",
            let: { industryId: "$industry" },
            pipeline: [
                {
                    $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
                },
                {
                    $project: { name: 1, _id: 0 },
                },
            ],
        }, "$industry", {
            fullName: "$fullName",
            avatar: "$avatar",
            cover: "$cover",
            isFeatured: "$isFeatured",
            rate: "$rate",
            rates: { $size: { $ifNull: ["$rates", []] } },
            industry: "$industry",
        }, 12, { createdAt: -1 });
        const records = yield (0, repo_3.customQuery)({
            type: { $in: ["nutrition", "fitness"] },
            "home.city": req.body.city._id,
            isActive: true,
        }, {
            from: "industries",
            as: "industry",
            let: { industryId: "$industry" },
            pipeline: [
                {
                    $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
                },
                {
                    $project: { name: 1, _id: 0 },
                },
            ],
        }, "$industry", {
            fullName: "$fullName",
            avatar: "$avatar",
            cover: "$cover",
            isFeatured: "$isFeatured",
            rate: "$rate",
            rates: { $size: { $ifNull: ["$rates", []] } },
            yearsOfExperience: "$yearsOfExperience",
            industry: "$industry",
        }, 50, { createdAt: -1 });
        res.json((0, responseTypes_1.resTypes)(200, { featured, records }));
    });
}
exports.consultants = consultants;
