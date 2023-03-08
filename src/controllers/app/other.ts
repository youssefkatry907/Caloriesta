import { Request, Response } from "express";
import { list as listCities, get as getCity } from "../../modules/City/repo";
import {
  list as listIndustries,
  get as getIndustry,
} from "../../modules/Industry/repo";
import {
  list as listCategories,
  get as getCategory,
} from "../../modules/Category/repo";
import { resTypes } from "../../helpers/responseTypes";
import Page from "../../modules/Page/model";
import Message from "../../modules/Message/model";

export async function cities(req: Request, res: Response) {
  if (req.params.id) {
    const result = await getCity(req.params.id);
    result.success
      ? res.json(resTypes(200, { record: result.record }))
      : res.json(resTypes(404, { errors: result.errors }));
  } else {
    const records = await listCities();
    res.json(resTypes(200, { records }));
  }
}

export async function industries(req: Request, res: Response) {
  if (req.params.id) {
    const result = await getIndustry(req.params.id);

    if (result.success) {
      res.json(resTypes(200, { record: result.record }));
    } else res.json(resTypes(400, { errors: result.errors }));
  } else {
    const records = await listIndustries();
    res.json(resTypes(200, { records }));
  }
}

export async function categories(req: Request, res: Response) {
  if (req.params.id) {
    const result = await getCategory(req.params.id);
    res.json(resTypes(200, { record: result.record }));
  } else {
    const records = await listCategories();
    res.json(resTypes(200, { records }));
  }
}

export async function getPage(req: Request, res: Response) {
  const record = await Page.findOne({});
  res.json(
    resTypes(200, {
      record: record[`${req.query.type}`],
    })
  );
}

export async function sendMessage(req: Request, res: Response) {
  if (req.body.name && req.body.phone && req.body.message) {
    const message = new Message(req.body);

    await message.save();
    res.json(
      resTypes(200, {
        record: message,
      })
    );
  } else {
    res.json(
      resTypes(400, {
        message: "name, phone, message are required",
      })
    );
  }
}
