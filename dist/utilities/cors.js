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
Object.defineProperty(exports, "__esModule", { value: true });
let allowedHeaders = [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Application/json",
    "X-app-token",
    "x-app-developer",
    "customer",
];
let allowedMethods = ["GET", "PUT", "PATCH", "POST", "DELETE"];
cors.defaultProps = {
    options: {
        allowCredential: true,
        allowedHeaders: [],
        allowedMethods,
        origin: "*",
    },
};
function cors(req, res, next, options) {
    return __awaiter(this, void 0, void 0, function* () {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "*");
        if (options.allowCredential)
            res.header("Access-Control-Allow-Credentials", "true");
        // handle option request
        if (req.method === "OPTIONS") {
            res.header("Access-Control-Allow-Methods", allowedMethods.join());
            return res.status(200).json({});
        }
        if (req.headers["x-app-token"] === "caloriesta_team" ||
            req.url.includes("uploads") ||
            !req.url.includes("api")) {
            next();
        }
        else
            return res
                .status(500)
                .json({ message: "something went wrong, please try again" });
    });
}
exports.default = cors;
