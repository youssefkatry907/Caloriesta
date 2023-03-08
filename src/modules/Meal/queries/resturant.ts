import db from "../../../database/mongo";

export default function discount(req) {
  if (req.query["resturant"]) {
    return {
      resturant: db.Types.ObjectId(req.query["resturant"]),
    };
  } else return false;
}
