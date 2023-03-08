import { Request, Response } from "express";
import { resTypes } from "../../helpers/responseTypes";
import Page from "../../modules/Page/model";

export async function updatePage(req: Request, res: Response) {
  const record = await Page.findOne({});
  if (record) {
    record[`${req.query["type"]}`] = req.body["content"];
    await record.save();
  }

  res.json(
    resTypes(200, {
      record: record[`${req.query["type"]}`],
      message: "page has been updated",
    })
  );
}
