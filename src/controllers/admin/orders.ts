import { resTypes } from "../../helpers/responseTypes";
import { get, list, update } from "../../modules/Order/repo";
import { Request, Response } from "express";


export async function listOrders(req: Request, res: Response) {
  const records = await list();
  res.json(resTypes(200, { records }));

}

export async function getUserOrders(req: Request, res: Response) {
  const orders = await get(req.params.id);
  if (orders) {
    res.json(resTypes(200, { orders }));
  } else res.json(resTypes(400, { errors: orders.errors }));
}

export async function updateOrder(req: Request, res: Response) {
  if (req.params.status) {
    req.body.status = req.params.status;
  }
  console.log(req.body.status);

  const result = await update(req.params.id, req.body);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}