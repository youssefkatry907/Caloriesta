export default function country(req) {
    if (req.query["name"]) {
      return {
        stringQuery: { $regex: decodeURI(req.query["country"]), $options: "i" },
      };
    } else return false;
  }
  