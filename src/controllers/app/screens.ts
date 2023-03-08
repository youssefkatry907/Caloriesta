import { Request, Response } from "express";
import Meal from "../../modules/Meal/model";
import {
  list as listPackages,
  get as getPackage,
} from "../../modules/Package/repo";
import { list as listMeals, get as getMeal } from "../../modules/Meal/repo";
import {
  list as listUsers,
  get as getUser,
  customQuery as userCustomQuery,
} from "../../modules/User/repo";
import User from "../../modules/User/model";
import { resTypes } from "../../helpers/responseTypes";

export async function home(req: Request, res: Response) {
  const packages = await listPackages({ "cities.city": req.body.city._id });

  let handledPackages = [];

  await Promise.all([
    packages.map((pkg: any) => {
      pkg.wallet = pkg.price = pkg.cities?.find(
        (city: any) => city?.city?.code == req.body.city.code
      ).price;
      pkg.currency = pkg.cities?.find(
        (city: any) => city?.city?.code == req.body.city.code
      ).city?.currency?.name;

      delete pkg.cities;

      handledPackages.push({
        _id: pkg._id,
        name: pkg.name,
        code: pkg.code,
        sort: pkg.sort,
        details: pkg.details,
        color: pkg.color,
        wallet: pkg.cities?.find(
          (city: any) => city?.city?.code == req.body.city.code
        ).wallet,
        price: pkg.cities?.find(
          (city: any) => city?.city?.code == req.body.city.code
        ).price,
      });
    }),
  ]);

  let consultQuery: any = {
    "home.city": req.body.city._id,
    isActive: true,
  };

  consultQuery["type"] = "nutrition";

  const nutritionConsultants = await userCustomQuery(
    consultQuery,
    {
      from: "industries",
      as: "industry",
      let: { industryId: "$industry" },
      pipeline: [
        {
          $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
        },
        {
          $project: { name: 1, _id: 0 },
        },
      ],
    },
    "$industry",

    {
      fullName: "$fullName",
      avatar: "$avatar",
      yearsOfExperience: "$yearsOfExperience",
      rate: "$rate",
      industry: "$industry",
      rates: { $size: { $ifNull: ["$rates", []] } },
    },
    12,
    { createdAt: -1 }
  );

  consultQuery["type"] = { $in: ["nutrition", "fitness"] };
  consultQuery["isTop"] = true;
  const topConsultant = await userCustomQuery(
    consultQuery,
    {
      from: "industries",
      as: "industry",
      let: { industryId: "$industry" },
      pipeline: [
        {
          $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
        },
        {
          $project: { name: 1, _id: 0 },
        },
      ],
    },
    "$industry",

    {
      fullName: "$fullName",
      avatar: "$avatar",
      yearsOfExperience: "$yearsOfExperience",
      rate: "$rate",
      industry: "$industry",
      rates: { $size: { $ifNull: ["$rates", []] } },
    },
    12,
    { createdAt: -1 }
  );

  consultQuery["type"] = "fitness";

  const fitnessConsultants = await userCustomQuery(
    consultQuery,
    {
      from: "industries",
      as: "industry",
      let: { industryId: "$industry" },
      pipeline: [
        {
          $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
        },
        {
          $project: { name: 1, _id: 0 },
        },
      ],
    },
    "$industry",
    {
      fullName: "$fullName",
      avatar: "$avatar",
      yearsOfExperience: "$yearsOfExperience",
      rate: "$rate",
      industry: "$industry",
      rates: { $size: { $ifNull: ["$rates", []] } },
    },
    12,
    { createdAt: -1 }
  );

  // get resturants in same city
  const resturants = await listUsers(
    {
      type: "resturant",
      "home.city": req.body.city._id,
      isActive: true,
    },
    "fullName avatar"
  );

  let ids = resturants.map((resturant: any) => resturant._id);

  let defaultQuery = {
    resturant: { $in: ids },
    isActive: true,
  };

  const latestMeals = await listMeals(
    defaultQuery,
    "image name calories resturant price discount finalPrice type rate quantity",
    {
      sort: { createdAt: -1 },
      limit: 12,
    }
  );

  console.log(resturants[0]);

  res.json(
    resTypes(200, {
      packages: handledPackages,
      latestMeals,
      nutritionConsultants,
      fitnessConsultants,
      resturants,
      topConsultant,
      currency: req.body.city.currency?.name,
    })
  );
}

export async function mealsScreen(req: Request, res: Response) {
  if (req.params.id) {
    const result = await Meal.findOne(
      { _id: req.params.id },
      "image name description calories resturant price discount finalPrice type rate rates quantity addons options category"
    ).populate({
      path: "resturant rates.user category",
      select: "fullName avatar name",
    });

    if (result) {
      res.json(
        resTypes(200, {
          record: result,
          currency: req.body.city.currency?.name,
        })
      );
    } else res.json(resTypes(400, { message: "meal not found" }));
  } else {
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

    let offersQ = {
      resturant: { $in: ids },
      isActive: true,
      "discount.value": { $gte: 5 },
    };

    const offers = await Meal.find(
      offersQ,
      "offerCover name calories resturant price discount finalPrice type rate quantity"
    )
      .populate({ path: "resturant", select: "fullName" })
      .limit(25);

    const records = await Meal.find(
      defaultQuery,
      "image name calories resturant price discount finalPrice type rate quantity category"
    )
      .populate({ path: "resturant category", select: "fullName name" })
      .limit(50)
      .sort({ createdAt: -1 });

    res.json(
      resTypes(200, {
        offers,
        records,
        currency: req.body.city.currency?.name,
      })
    );
  }
}

export async function packages(req: Request, res: Response) {
  if (req.params.id) {
    const result = await getPackage(req.params.id);

    if (result.success) {
      res.json(resTypes(200, { record: result.record }));
    } else res.json(resTypes(400, { errors: result.errors }));
  } else {
    const records = await listPackages();
    res.json(resTypes(200, { records }));
  }
}

export async function restaurants(req: Request, res: Response) {
  if (req.params.id) {
    const restaurant = await getUser(req.params.id);

    let query = {
      resturant: restaurant.record._id,
      isActive: true,
    };

    const meals = await Meal.find(
      query,
      "image name calories resturant price discount finalPrice type rate quantity category"
    )
      .populate({ path: "resturant category", select: "fullName name" })
      .sort({ createdAt: -1 })
      .limit(25);

    res.json(
      resTypes(200, {
        record: {
          name: restaurant?.record?.fullName,
          avatar: restaurant?.record?.avatar,
          rate: restaurant?.record?.rate,
        },
        sliders: restaurant.record.sliders ?? [],
        meals,
      })
    );
  } else {
    let query: any = {
      type: "resturant",
      "home.city": req.body.city._id,
      isActive: true,
      rate: { $gte: 2 },
    };

    const featured = await userCustomQuery(
      query,
      null,
      null,

      {
        fullName: "$fullName",
        avatar: "$avatar",
        cover: "$cover",
        rate: "$rate",
        rates: { $size: { $ifNull: ["$rates", []] } },
      },
      12,
      { createdAt: -1 }
    );

    query["rate"] = { $gte: 0 };

    const records = await userCustomQuery(
      query,
      null,
      null,

      {
        fullName: "$fullName",
        avatar: "$avatar",
        cover: "$cover",
        rate: "$rate",
        rates: { $size: { $ifNull: ["$rates", []] } },
      },
      50,
      { createdAt: -1 }
    );

    res.json(resTypes(200, { featured, records }));
  }
}

export async function consultants(req: Request, res: Response) {
  let query = {
    type: { $in: ["nutrition", "fitness"] },
    "home.city": req.body.city._id,
    isActive: true,
    rate: { $gte: 2 },
  };

  const featured = await userCustomQuery(
    query,
    {
      from: "industries",
      as: "industry",
      let: { industryId: "$industry" },
      pipeline: [
        {
          $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
        },
        {
          $project: { name: 1, _id: 0 },
        },
      ],
    },
    "$industry",
    {
      fullName: "$fullName",
      avatar: "$avatar",
      cover: "$cover",
      isFeatured: "$isFeatured",
      rate: "$rate",
      rates: { $size: { $ifNull: ["$rates", []] } },
      industry: "$industry",
    },
    12,
    { createdAt: -1 }
  );

  const records = await userCustomQuery(
    {
      type: { $in: ["nutrition", "fitness"] },
      "home.city": req.body.city._id,
      isActive: true,
    },
    {
      from: "industries",
      as: "industry",
      let: { industryId: "$industry" },
      pipeline: [
        {
          $match: { $expr: { $eq: ["$$industryId", "$_id"] } },
        },
        {
          $project: { name: 1, _id: 0 },
        },
      ],
    },
    "$industry",
    {
      fullName: "$fullName",
      avatar: "$avatar",
      cover: "$cover",
      isFeatured: "$isFeatured",
      rate: "$rate",
      rates: { $size: { $ifNull: ["$rates", []] } },
      yearsOfExperience: "$yearsOfExperience",
      industry: "$industry",
    },
    50,
    { createdAt: -1 }
  );

  res.json(resTypes(200, { featured, records }));
}
