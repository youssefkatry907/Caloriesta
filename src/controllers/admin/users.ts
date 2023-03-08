import { resTypes } from "../../helpers/responseTypes";
import { remove, get, list } from "../../modules/User/repo";
import { Request, Response } from "express";
import { register, updateInfo, updateFiles } from "../customer";

export async function listUser(req: Request, res: Response) {
  if (req.params.id) {
    const result = await get(req.params.id);

    return result.success
      ? res.json(resTypes(200, { record: result.record }))
      : res.status(result.code).json(resTypes(result.code, result));
  }
  let results = await list({ type: { $in: req.query.type } });
  res.json(resTypes(200, { records: results }));
}

export async function createUser(req: Request, res: Response) {
  await register(req, res);
}

export async function updateUser(req: Request, res: Response) {
  const result = await get(req.params.id);
  req.body.user = result.record;
  await updateInfo(req, res);
}

export async function updateUserFiles(req: Request, res: Response) {
  const result = await get(req.params.id);
  req.body.user = result.record;
  await updateFiles(req, res);
}

export async function toggleUserActive(req: Request, res: Response) {
  const result = await get(req.params.id);

  if (result.success) {
    result.record.isActive = !result.record.isActive;
    await result.record.save();

    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function toggleIsTop(req: Request, res: Response) {
  const result = await get(req.params.id);

  if (result.success) {
    result.record.isTop = !result.record.isTop;
    await result.record.save();

    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}

export async function removeUser(req: Request, res: Response) {
  const result = await remove(req.params.id);

  if (result.success) {
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, { errors: result.errors }));
}
