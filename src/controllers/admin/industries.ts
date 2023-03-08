import { resTypes } from "../../helpers/responseTypes";
import { create, update, remove, list, get } from "../../modules/Industry/repo";
import { Request, Response } from "express";

export async function listIndustry(req: Request, res: Response) {
  const results = await list();
  res.json(resTypes(200, { records: results }));
}

export async function createIndustry(req: Request, res: Response) {
  const result = await create(req.body);

  if (result.success) {
    await result.record.save();
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updateIndustry(req: Request, res: Response) {
  const result = await update(req.params.id, req.body);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function deleteIndustry(req: Request, res: Response) {
  const result = await remove(req.params.id);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}
