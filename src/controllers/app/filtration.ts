import { Request, Response } from "express";
import Meal from "../../modules/Meal/model";
import {
  list as listUsers,
  get as getUser,
  customQuery as userCustomQuery,
} from "../../modules/User/repo";
import queriesCollection from "../../modules/Meal/queries";
import { resTypes } from "../../helpers/responseTypes";

export async function meals(req: Request, res: Response) {
  // get resturants in same city
  const resturants = await listUsers(
    {
      type: "resturant",
      "home.city": req.body.city._id,
      isActive: true,
    },
    "name"
  );

  let ids = resturants.map((resturant: any) => resturant._id);

  let defaultQuery = {
    resturant: { $in: ids },
    isActive: true,
  };

  const q = await queriesCollection(req);
  let queries = q.queriesArr;
  queries.push(defaultQuery);

  const page = req.query.page ? Number(req.query.page) : 1;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 50;

  const totalResults = await Meal.countDocuments({
    ...defaultQuery,
    ...q.queriesObj,
  });

  console.log("totalResults", totalResults);
  console.log("queries", queries);

  const records = await Meal.aggregate([
    {
      $match: {
        $and: queries,
      },
    },
    {
      $lookup: {
        from: "users",
        as: "resturant",
        let: { resturantId: "$resturant" },
        pipeline: [
          {
            $match: { $expr: { $eq: ["$$resturantId", "$_id"] } },
          },
          {
            $project: { fullName: 1, _id: 0, avatar: 1 },
          },
        ],
      },
    },
    {
      $unwind: "$resturant",
    },
    {
      $project: {
        name: "$name",
        image: "$image",
        price: `$price`,
        finalPrice: `$finalPrice`,
        discount: `$discount`,
        quantity: "$quantity",
        isActive: "$isActive",
        calories: "$calories",
        category: "$category",
        type: "$type",
        rate: "$rate",
        resturant: "$resturant",
      },
    },
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize },
  ]);

  console.log("records", records);

  res.json(
    resTypes(200, {
      data: {
        records,
        pagination: {
          page,
          pageSize,
          totalITems: totalResults,
          totalPages: Math.ceil(Number(totalResults / pageSize)),
        },
        currency: req.body.city.currency?.name,
      },
    })
  );
}

export async function users(req: Request, res: Response) {
  if (req.params.id) {
    const result = await getUser(req.params.id);

    if (result.success) {
      res.json(resTypes(200, { record: result.record }));
    } else res.json(resTypes(400, { errors: result.errors }));
  } else {
    if (
      !req.query.type ||
      !["nutrition", "fitness", "resturant"].includes(`${req.query.type}`)
    ) {
      res.json(
        resTypes(400, {
          message:
            "you must send one of users types [nutrition, fitness, resturant]",
        })
      );
    } else {
      let query = {
        type: req.query.type,
        "home.city": req.body.city._id,
        isActive: true,
      };

      if (req.query.industry) query["industry"] = { $in: req.query.industry };
      if (req.query.rate) query["rate"] = { $in: req.query.rate };
      const records = await listUsers(
        query,
        "fullName avatar industry rate home isActive isFeatured type yearsOfExperience cover"
      );
      res.json(resTypes(200, { records }));
    }
  }
}
