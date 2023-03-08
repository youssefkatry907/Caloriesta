import { Request, Response } from "express";
import { resTypes } from "../../helpers/responseTypes";
import Meal from "../../modules/Meal/model";
import User from "../../modules/User/model";
import City from "../../modules/City/model";

export async function statistics(req: Request, res: Response) {
  const customers = await User.countDocuments({ type: "customer" });
  const nutrition = await User.countDocuments({ type: "nutrition" });
  const fitness = await User.countDocuments({ type: "fitness" });
  const stuff = await User.countDocuments({ type: "stuff" });
  const resturant = await User.countDocuments({ type: "resturant" });
  const meals = await Meal.countDocuments();

  const cities = await City.find().select("name cover");

  let citiesMetrics = [];

  await Promise.all(
    cities.map(async (city: any) => {
      const cityCustomers = await User.countDocuments({
        type: "customer",
        "home.city": city._id,
      });
      const citynutrition = await User.countDocuments({
        type: "nutrition",
        "home.city": city._id,
      });
      const cityfitness = await User.countDocuments({
        type: "fitness",
        "home.city": city._id,
      });
      const cityresturant = await User.find({
        type: "resturant",
        "home.city": city._id,
      }).select("_id");
      const citymeals = await Meal.countDocuments({
        resturant: { $in: cityresturant.map((res: any) => res._id) },
        isActive: true,
      });
      citiesMetrics.push({
        city,
        customers: cityCustomers,
        nutrition: citynutrition,
        fitness: cityfitness,
        resturant: cityresturant.length,
        meals: citymeals,
      });
    })
  );

  res.json(
    resTypes(200, {
      statistics: [
        {
          name: "total users",
          value: customers,
        },

        {
          name: "nutritions",
          value: nutrition,
        },
        {
          name: "fitness",
          value: fitness,
        },
        {
          name: "stuff",
          value: stuff,
        },
        {
          name: "resturants",
          value: resturant,
        },
        {
          name: "meals",
          value: meals,
        },
      ],
      citiesMetrics,
    })
  );
}
