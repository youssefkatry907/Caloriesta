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
exports.statistics = void 0;
const responseTypes_1 = require("../../helpers/responseTypes");
const model_1 = __importDefault(require("../../modules/Meal/model"));
const model_2 = __importDefault(require("../../modules/User/model"));
const model_3 = __importDefault(require("../../modules/City/model"));
function statistics(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const customers = yield model_2.default.countDocuments({ type: "customer" });
        const nutrition = yield model_2.default.countDocuments({ type: "nutrition" });
        const fitness = yield model_2.default.countDocuments({ type: "fitness" });
        const stuff = yield model_2.default.countDocuments({ type: "stuff" });
        const resturant = yield model_2.default.countDocuments({ type: "resturant" });
        const meals = yield model_1.default.countDocuments();
        const cities = yield model_3.default.find().select("name cover");
        let citiesMetrics = [];
        yield Promise.all(cities.map((city) => __awaiter(this, void 0, void 0, function* () {
            const cityCustomers = yield model_2.default.countDocuments({
                type: "customer",
                "home.city": city._id,
            });
            const citynutrition = yield model_2.default.countDocuments({
                type: "nutrition",
                "home.city": city._id,
            });
            const cityfitness = yield model_2.default.countDocuments({
                type: "fitness",
                "home.city": city._id,
            });
            const cityresturant = yield model_2.default.find({
                type: "resturant",
                "home.city": city._id,
            }).select("_id");
            const citymeals = yield model_1.default.countDocuments({
                resturant: { $in: cityresturant.map((res) => res._id) },
                isActive: true,
            });
            citiesMetrics.push({
                city,
                customers: cityCustomers,
                nutrition: citynutrition,
                fitness: cityfitness,
                resturant: cityresturant.length,
                meals: citymeals,
            });
        })));
        res.json((0, responseTypes_1.resTypes)(200, {
            statistics: [
                {
                    name: "total users",
                    value: customers,
                },
                {
                    name: "nutritions",
                    value: nutrition,
                },
                {
                    name: "fitness",
                    value: fitness,
                },
                {
                    name: "stuff",
                    value: stuff,
                },
                {
                    name: "resturants",
                    value: resturant,
                },
                {
                    name: "meals",
                    value: meals,
                },
            ],
            citiesMetrics,
        }));
    });
}
exports.statistics = statistics;
