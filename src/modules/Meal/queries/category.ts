import getNested from "../../Category/helpers/getNested";

export default async function category(req) {
  if (req.query["categories"]) {
    let categories = [];
    if (Array.isArray(req.query["categories"])) {
      await Promise.all(
        req.query["categories"].map(async (item) => {
          let subs = await getNested(item);
          categories = categories.length ? [...categories, ...subs] : subs;
        })
      );

      return {
        category: { $in: categories },
      };
    }
  } else return false;
}
