import { resTypes } from "../../helpers/responseTypes";
import { create, update, remove } from "../../modules/Category/repo";
import { Request, Response } from "express";

export async function createCategory(req: Request, res: Response) {
  const result = await create(req.body);

  if (result.success) {
    await result.record.save();
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updateCategory(req: Request, res: Response) {
  const result = await update(req.params.id, req.body);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function deleteCategory(req: Request, res: Response) {
  const result = await remove(req.params.id);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}
