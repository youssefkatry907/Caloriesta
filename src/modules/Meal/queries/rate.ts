export default function rate(req) {
  if (req.query["rate"]) {
    return {
      rate: {
        $gte: parseInt(req.query["rate"]),
      },
    };
  } else return false;
}
