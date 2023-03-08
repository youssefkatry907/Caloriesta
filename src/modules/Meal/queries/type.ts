export default function type(req) {
  if (req.query["type"]) {
    return {
      type: req.query["type"],
    };
  } else return false;
}
