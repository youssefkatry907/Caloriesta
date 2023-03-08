import { resTypes } from "../../helpers/responseTypes";
import { create, update, remove, get, list } from "../../modules/Coupon/repo";
import { Request, Response } from "express";

export async function listCoupons(req: Request, res: Response) {
  if (req.params.id) {
    const result = await get(req.params.id);
    res.json(resTypes(200, { record: result.record }));
  } else {
    const records = await list();
    res.json(resTypes(200, { records }));
  }
}

export async function createCoupon(req: Request, res: Response) {
  const result = await create(req.body);

  if (result.success) {
    await result.record.save();
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function updateCoupon(req: Request, res: Response) {
  const result = await update(req.params.id, req.body);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function deleteCoupon(req: Request, res: Response) {
  const result = await remove(req.params.id);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}
