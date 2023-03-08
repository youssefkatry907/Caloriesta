"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = exports.genSlug = void 0;
function genSlug(cityName, regionName, recordSerial) {
    let cityCode = slugify(cityName);
    let regionCode = slugify(regionName);
    return `${cityCode}_${regionCode}${recordSerial}`.toUpperCase();
}
exports.genSlug = genSlug;
function slugify(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
}
exports.slugify = slugify;
