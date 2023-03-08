import { setUser } from "@sentry/minimal";
import { isPremit } from "../helpers/isCan";
import { verifyToken } from "../helpers/jwt";
import { resTypes } from "../helpers/responseTypes";
import User from "../modules/User/model";

export async function isCustomer(req, res, next) {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];

    const user = await User.isExist(verifyToken(token).email);

    if (verifyToken(token) && user) {
      req["user"] = verifyToken(token)._id;
      next();
    } else res.status(401).json(resTypes(401));
  }
}

export function isAdmin(req, res, next) {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split(" ")[1];
    if (verifyToken(token) && User.isAdmin(verifyToken(token)._id)) next();
    else res.status(401).json(resTypes[401]);
  }
}

export function isCan(req: Request, res, next) {
  if (req.body["user"]?.type === "stuff") {
    const module =
      req["baseUrl"].split("/")[2].charAt(0).toUpperCase() +
      req["baseUrl"].split("/")[2].slice(1);
    isPremit(req.body["user"], module, req.method, req["originalUrl"])
      ? next()
      : res.status(401).json(resTypes[401]);
  } else next();
}
