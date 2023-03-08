import { resTypes } from "../../helpers/responseTypes";
import { create, update, remove, list, get } from "../../modules/Package/repo";
import { Request, Response } from "express";
import upload from "../../helpers/upload";
import fs from "fs";
import { getPath } from "../../helpers/getPath";

export async function listPackage(req: Request, res: Response) {
  let results = await list();
  results.map((p: any) => {
    if (p.cover) p.cover = getPath() + p.cover;
  });
  res.json(resTypes(200, { records: results }));
}

export async function getPackage(req: Request, res: Response) {
  const result = await get(req.params.id);

  if (result.success) {
    if (result.record.icon) result.record.icon = getPath() + result.record.icon;
    res.json(resTypes(200, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function createPackage(req: Request, res: Response) {
  const result = await create(req.body);

  if (result.success) {
    await result.record.save();
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updatePackage(req: Request, res: Response) {
  const result = await update(req.params.id, req.body);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function deletePackage(req: Request, res: Response) {
  const result = await remove(req.params.id);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updateCover(req, res) {
  const p = await get(req.params.id);

  if (p.success) {
    upload(`packages/${p.record.code}`).parse(
      req,
      async (err, fields, files) => {
        if (err) {
          console.log(err);
        }

        const params = ["icon"];

        params.map((param: string) => {
          if (files[param]) {
            // delete old file
            if (p.record[param]) {
              try {
                fs.unlinkSync(`./${p.record[param]}`);
              } catch (err) {
                console.log("can't remove file", err);
              }
            }
            p.record[param] = files[param].path;
          }
        });

        await p.record.save();

        if (p.record.icon) p.record.icon = getPath() + p.record.icon;

        res.json(resTypes(201, { record: p.record }));
      }
    );
  } else res.status(400).json(resTypes(404));
}
