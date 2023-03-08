import { resTypes } from "../helpers/responseTypes";
import { get, list, create, remove } from "../modules/Chat/repo";
import { get as getUser } from "../modules/User/repo"
import { Request, Response } from "express";


export async function listMessages(req: Request, res: Response) {

    if (req.params.id) {
        const receiver: any = await getUser(req.params.id);
        if (receiver) {
            const records = await list({ receiver: req.params.id });
            res.json(resTypes(200, { records }));
        }
        else {
            res.status(401)
                .json(resTypes(401, { message: "There are no messages" }));
        }
    }
    else {
        res.status(401).json(resTypes(401, { message: "id is missed" }));
    }
}


export async function getMessage(req: Request, res: Response) {
    const message = await get(req.params.id);

    if (message.success) {
        res.json(
            resTypes(200, { message: message.record })
        );
    } else
        res.status(message.code)
            .json(resTypes(message.code, { errors: message.errors }));
}

export async function sendMessage(req: Request, res: Response) {
    const result = await create(req.body);

    if (result.success) {
        await result.record.save();
        res.json(resTypes(201, { record: result.record }));
    } else res.json(resTypes(400, {}));
    //errors: result.errors 
}

//make an api to delete message
export async function deleteMessage(req: Request, res: Response){
    if (req.params.id) {
        const result = await remove(req.params.id);
        res.status(200).json(
          resTypes(200, {
            message: `message has been removed`,
            result
          })
        );
      } else {
        res.status(404).json(
          resTypes(404, {
            message: `message not found`,
          })
        );
      }
}
