export default function name(req) {
  if (req.query["name"]) {
    return {
      stringQuery: { $regex: decodeURI(req.query["name"]), $options: "i" },
    };
  } else return false;
}
