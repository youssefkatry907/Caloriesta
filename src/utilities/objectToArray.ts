export default function objectToArray(object: object) {
  return Object.keys(object).map((key: string) => object[key]);
}
