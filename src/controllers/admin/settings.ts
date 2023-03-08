import { resTypes } from "../../helpers/responseTypes";
import { update, get } from "../../modules/Info/repo";
import { Request, Response } from "express";
import upload from "../../helpers/upload";
import fs from "fs";

export async function getSettings(req: Request, res: Response) {
  const result = await get();
  res.json(resTypes(200, { record: result.settings }));
}

export async function updateSettings(req: Request, res: Response) {
  const { settings } = await update(req.body);
  res.json(
    resTypes(200, {
      record: settings,
    })
  );
}

export async function updateFiles(req, res) {
  const result = await get();

  upload(`settings`).parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
    }

    const params = ["logoAr", "logoEn", "favico"];

    params.map((param: string) => {
      if (files[param]) {
        // delete old file
        if (result.settings[param]) {
          try {
            fs.unlinkSync(`./${result.settings[param]}`);
          } catch (err) {
            console.log("can't remove file", err);
          }
        }
        result.settings[param] = files[param].path;
      }
    });

    await result.settings.save();

    res.json(resTypes(201, { record: result.settings }));
  });
}
