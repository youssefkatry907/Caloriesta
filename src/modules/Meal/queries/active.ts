export default function active(req) {
  if (req.query["active"]) {
    return {
      isActive: req.query["active"] == "true" ? true : false,
    };
  } else return false;
}
