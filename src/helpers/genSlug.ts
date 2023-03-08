export function genSlug(
  cityName: string,
  regionName: string,
  recordSerial: number
) {
  let cityCode = slugify(cityName);
  let regionCode = slugify(regionName);
  return `${cityCode}_${regionCode}${recordSerial}`.toUpperCase();
}

export function slugify(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}
