import { resTypes } from "../helpers/responseTypes";
import { create, update, remove, get, list } from "../modules/Meal/repo";
import { Request, Response } from "express";
import upload from "../helpers/upload";
import fs from "fs";

export async function listMeals(req: Request, res: Response) {
  console.log(req.body.user._id);
  console.log(req.body.user);

  if (req.params.id) {
    const result: any = await get(req.params.id);
    if (result.record.resturant?._id == req.body.user._id)
      res.json(resTypes(200, { record: result.record }));
    else
      res
        .status(401)
        .json(resTypes(401, { message: "You're not allowed for this action" }));
  } else {
    const records = await list({ resturant: req.body.user._id });
    res.json(resTypes(200, { records }));
  }
}

export async function createMeal(req: Request, res: Response) {
  req.body.resturant = req.body.user._id;
  const result = await create(req.body);

  if (result.success) {
    await result.record.save();
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updateMeal(req: Request, res: Response) {
  req.body.resturant = req.body.user._id;
  const result = await update(req.params.id, req.body);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function deleteMeal(req: Request, res: Response) {
  const result = await remove(req.params.id);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updateMealImage(req, res) {
  const meal = await get(req.params.id);

  if (meal.success) {
    upload(`users/${meal.record.resturant["username"]}/meals`).parse(
      req,
      async (err, fields, files) => {
        if (err) {
          res.status(400).json({
            errors: [
              {
                key: "image",
                value: "file size must be no more than 3 mb",
              },
            ],
          });
        }

        const params = ["image", "offerCover"];

        params.map((param: string) => {
          if (files[param]) {
            // delete old file
            if (meal.record[param]) {
              try {
                fs.unlinkSync(`./${meal.record[param]}`);
              } catch (err) {
                console.log("can't remove file", err);
              }
            }
            meal.record[param] = files[param].path;
          }
        });

        await meal.record.save();

        res.json(resTypes(201, { record: meal.record }));
      }
    );
  } else res.status(400).json(resTypes(404));
}

// reports
