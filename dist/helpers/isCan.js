"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPremit = void 0;
function isPremit(user, module, permission, url) {
    var _a;
    let types = {
        GET: "list",
        PUT: "update",
        PATCH: "update",
        DELETE: "delete",
    };
    if (module === "Users") {
        module =
            url.split("=")[1].charAt(0).toUpperCase() +
                url.split("=")[1].slice(1) +
                "s";
    }
    console.log("module", module);
    console.log("module", user["role"]["permissions"].find((item) => item.name === module));
    return (_a = user["role"]["permissions"].find((item) => item.name === module)) === null || _a === void 0 ? void 0 : _a.roles[types[permission]];
}
exports.isPremit = isPremit;
