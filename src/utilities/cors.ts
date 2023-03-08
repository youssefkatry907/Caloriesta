import { Request, Response } from "express-serve-static-core";

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

type options = {
  allowCredential?: boolean;
  allowedHeaders?: Array<string>;
  allowedMethods?: Array<string>;
  origin: string;
};

cors.defaultProps = {
  options: {
    allowCredential: true,
    allowedHeaders: [],
    allowedMethods,
    origin: "*",
  },
};

export default async function cors(
  req: Request,
  res: Response,
  next,
  options: options
) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (options.allowCredential)
    res.header("Access-Control-Allow-Credentials", "true");

  // handle option request
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", allowedMethods.join());
    return res.status(200).json({});
  }

  if (
    req.headers["x-app-token"] === "caloriesta_team" ||
    req.url.includes("uploads") ||
    !req.url.includes("api")
  ) {
    next();
  } else
    return res
      .status(500)
      .json({ message: "something went wrong, please try again" });
}
