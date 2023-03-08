export default function calories(req) {
  if (req.query["calories_from"] && req.query["calories_to"]) {
    return {
      calories: {
        $gte: parseInt(req.query["calories_from"]),
        $lte: parseInt(req.query["calories_to"]),
      },
    };
  } else return false;
}
