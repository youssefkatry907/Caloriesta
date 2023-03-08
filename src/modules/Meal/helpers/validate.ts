import { Response } from "express";
import { resTypes } from "../../../helpers/responseTypes";

export function validateMeal(payload: any, res: Response) {
  let errors = [];

  if (!payload.name || !payload.name.ar || !payload.name.en) {
    errors.push({
      key: "name",
      value: "name must exist",
    });
  }
  if (!payload.resturant) {
    errors.push({
      key: "resturant",
      value: "resturant must exist",
    });
  }
  if (!payload.category) {
    errors.push({
      key: "category",
      value: "category must exist",
    });
  }
  if (!payload.price) {
    errors.push({
      key: "price",
      value: "price must exist",
    });
  }
  if (!payload.description) {
    errors.push({
      key: "description",
      value: "description must exist",
    });
  }
  if (!payload.quantity && payload.quantity != 0) {
    errors.push({
      key: "quantity",
      value: "quantity must exist",
    });
  }

  return errors.length
    ? res.status(400).json(
        resTypes(400, {
          errors,
        })
      )
    : true;
}
