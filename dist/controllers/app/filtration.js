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
exports.users = exports.meals = void 0;
const model_1 = __importDefault(require("../../modules/Meal/model"));
const repo_1 = require("../../modules/User/repo");
const queries_1 = __importDefault(require("../../modules/Meal/queries"));
const responseTypes_1 = require("../../helpers/responseTypes");
function meals(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // get resturants in same city
        const resturants = yield (0, repo_1.list)({
            type: "resturant",
            "home.city": req.body.city._id,
            isActive: true,
        }, "name");
        let ids = resturants.map((resturant) => resturant._id);
        let defaultQuery = {
            resturant: { $in: ids },
            isActive: true,
        };
        const q = yield (0, queries_1.default)(req);
        let queries = q.queriesArr;
        queries.push(defaultQuery);
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 50;
        const totalResults = yield model_1.default.countDocuments(Object.assign(Object.assign({}, defaultQuery), q.queriesObj));
        console.log("totalResults", totalResults);
        console.log("queries", queries);
        const records = yield model_1.default.aggregate([
            {
                $match: {
                    $and: queries,
                },
            },
            {
                $lookup: {
                    from: "users",
                    as: "resturant",
                    let: { resturantId: "$resturant" },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$$resturantId", "$_id"] } },
                        },
                        {
                            $project: { fullName: 1, _id: 0, avatar: 1 },
                        },
                    ],
                },
            },
            {
                $unwind: "$resturant",
            },
            {
                $project: {
                    name: "$name",
                    image: "$image",
                    price: `$price`,
                    finalPrice: `$finalPrice`,
                    discount: `$discount`,
                    quantity: "$quantity",
                    isActive: "$isActive",
                    calories: "$calories",
                    category: "$category",
                    type: "$type",
                    rate: "$rate",
                    resturant: "$resturant",
                },
            },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
        ]);
        console.log("records", records);
        res.json((0, responseTypes_1.resTypes)(200, {
            data: {
                records,
                pagination: {
                    page,
                    pageSize,
                    totalITems: totalResults,
                    totalPages: Math.ceil(Number(totalResults / pageSize)),
                },
                currency: (_a = req.body.city.currency) === null || _a === void 0 ? void 0 : _a.name,
            },
        }));
    });
}
exports.meals = meals;
function users(req, res) {
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
            if (!req.query.type ||
                !["nutrition", "fitness", "resturant"].includes(`${req.query.type}`)) {
                res.json((0, responseTypes_1.resTypes)(400, {
                    message: "you must send one of users types [nutrition, fitness, resturant]",
                }));
            }
            else {
                let query = {
                    type: req.query.type,
                    "home.city": req.body.city._id,
                    isActive: true,
                };
                if (req.query.industry)
                    query["industry"] = { $in: req.query.industry };
                if (req.query.rate)
                    query["rate"] = { $in: req.query.rate };
                const records = yield (0, repo_1.list)(query, "fullName avatar industry rate home isActive isFeatured type yearsOfExperience cover");
                res.json((0, responseTypes_1.resTypes)(200, { records }));
            }
        }
    });
}
exports.users = users;
