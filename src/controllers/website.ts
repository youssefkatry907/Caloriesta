import { Request, Response } from "express";
import path from "path";

export async function home(req: Request, res: Response) {
  res.render(path.join(__dirname + "../../../views/index.pug"));
}
