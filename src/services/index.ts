import axios from "axios";

axios.defaults.baseURL =
  process.env.NODE_ENV == "development"
    ? "http://localhost:8084/system/api/v2"
    : "http://localhost:8084/system/api/v2";
axios.defaults.headers.common["x-app-token"] = "motajerSystemToken";
axios.defaults.headers.common["Content-Type"] =
  "application/x-www-form-urlencoded";

const endPoint = axios;

export default endPoint;
