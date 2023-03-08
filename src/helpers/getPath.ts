export function getPath() {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:9000/"
    : "http://192.241.145.207/";
}
