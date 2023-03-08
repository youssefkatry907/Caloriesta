import { Request, Response } from "express";
import { resTypes } from "../../helpers/responseTypes";
import { list, get, remove } from "../../modules/Message/repo";

export async function listMessages(req: Request, res: Response) {
  if (req.params.id) {
    const record = await get(req.params.id);
    if (record.success) {
      res.json(
        resTypes(200, {
          record: record.record,
        })
      );
    } else {
      res.json(
        resTypes(404, {
          message: "message not found",
        })
      );
    }
  } else {
    const records = await list();
    res.json(
      resTypes(200, {
        records,
      })
    );
  }
}

export async function removeMessage(req: Request, res: Response) {
  const message = await get(req.params.id);
  if (message.success) {
    await remove(req.params.id);
    res.json(
      resTypes(200, {
        message: "message has been removed",
      })
    );
  } else {
    res.json(
      resTypes(404, {
        message: "message not found",
      })
    );
  }
}
