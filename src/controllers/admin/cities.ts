import { resTypes } from "../../helpers/responseTypes";
import { create, update, remove, list, get } from "../../modules/City/repo";
import { Request, Response } from "express";
import upload from "../../helpers/upload";
import fs from "fs";
import { getPath } from "../../helpers/getPath";

export async function listCity(req: Request, res: Response) {
  let results = await list();
  results.map((city: any) => {
    if (city.cover) city.cover = getPath() + city.cover;
  });
  res.json(resTypes(200, { records: results }));
}

export async function getCity(req: Request, res: Response) {
  const result = await get(req.params.id);

  if (result.success) {
    if (result.record.cover)
      result.record.cover = getPath() + result.record.cover;
    res.json(resTypes(200, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function createCity(req: Request, res: Response) {
  if (req.body.phoneLength)
    req.body.phoneLength = parseInt(req.body.phoneLength);
  if (req.body.sort) req.body.sort = parseInt(req.body.sort);
  const result = await create(req.body);

  if (result.success) {
    await result.record.save();
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updateCity(req: Request, res: Response) {
  const result = await update(req.params.id, req.body);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function deleteCity(req: Request, res: Response) {
  const result = await remove(req.params.id);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updateCover(req, res) {
  const city = await get(req.params.id);

  if (city.success) {
    upload(`cities/${city.record.code}`).parse(
      req,
      async (err, fields, files) => {
        if (err) {
          console.log(err);
        }

        const params = ["cover"];

        params.map((param: string) => {
          if (files[param]) {
            // delete old file
            if (city.record[param]) {
              try {
                fs.unlinkSync(`./${city.record[param]}`);
              } catch (err) {
                console.log("can't remove file", err);
              }
            }
            city.record[param] = files[param].path;
          }
        });

        await city.record.save();

        if (city.record.cover)
          city.record.cover = getPath() + city.record.cover;

        res.json(resTypes(201, { record: city.record }));
      }
    );
  } else res.status(400).json(resTypes(404));
}
