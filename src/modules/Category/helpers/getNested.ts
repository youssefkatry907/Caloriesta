import Category from "../model";
import mongoose from "mongoose";

export default async function getNested(category: string) {
  let categories = [];

  let target = await Category.findOne({
    _id: mongoose.Types.ObjectId(category),
  }).populate({
    path: "subCategories",
    select: "name",
    populate: {
      path: "subCategories",
      select: "name",
      populate: {
        path: "subCategories",
        select: "name",
        populate: {
          path: "subCategories",
          select: "name",
          populate: {
            path: "subCategories",
            select: "name",
          },
        },
      },
    },
  });

  if (target) {
    categories.push(target._id);
    if (target.subCategories.length) getSub(target);
  }

  function getSub(one) {
    if (one && one.subCategories && one.subCategories.length) {
      one.subCategories.map((s) => {
        categories.push(s._id);
        getSub(s);
      });
    }
  }

  return categories;
}
