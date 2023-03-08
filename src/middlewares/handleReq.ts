import { verifyToken } from "../helpers/jwt";
import { resTypes } from "../helpers/responseTypes";
import { get } from "../modules/City/repo";

export default function handleReq(req, res, next) {
  const exclude = [
    "/login",
    "/register",
    "/reset-password-code",
    "/validate-reset-code",
    "/reset-password",
  ];

  if (!exclude.includes(req.url)) {
    if (req.headers.authorization && req.headers.authorization.split(" ")[1]) {
      let token = req.headers.authorization.split(" ")[1];

      if (token && verifyToken(token)) req.body.user = verifyToken(token);
      else res.json(resTypes(401));
    } else res.json(resTypes(401));
  }
  next();
}

export async function handleCityReq(req, res, next) {
  if (req.headers.city) {
    const city = await get(req.headers.city, "code");

    if (city.success) {
      req.body.city = city.record;
      next();
    } else
      res.status(400).json(resTypes(400, { message: "country not found" }));
  } else
    res
      .status(400)
      .json(
        resTypes(400, { message: "must send country code to filter data" })
      );
}
