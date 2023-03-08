import Notification from "../modules/Notifications/model"
import { get as getUser } from "../modules/User/repo"
import { Request, Response } from "express";
import { create, get, list, remove } from "../modules/Notifications/repo"
import { resTypes } from "../helpers/responseTypes";
//list
export async function listNotifications(req: Request, res: Response) {

  if (req.params.id) {
    const receiver: any = await getUser(req.params.id);
    if (receiver) {
      // list all notifications for a user which are not opened

      const records = await list({ isOpened: false , receiver: req.params.id })
      res.json(resTypes(200, { records }));
    }
    else {
      res.status(401)
        .json(resTypes(401, { message: "There are no notifications" }));
    }
  }
  else {
    res.status(401).json(resTypes(401, { message: "id is missed" }));
  }
}


export async function getNotification(req: Request, res: Response) {
  const notification = await get(req.params.id);

  if (notification.success) {
    //update notification status to true
    await Notification.updateOne({ _id: req.params.id }, { isOpened: true });
    res.json(
      resTypes(200, { notification: notification.record })
    );
  }
  else
    res.status(notification.code)
      .json(resTypes(notification.code, { errors: notification.errors }));
}


//create
export async function sendNotification(req: Request, res: Response) {
  const result = await create(req.body);

  if (result.success) {
    await Notification.updateMany({ _id: req.params.id }, { isOpened: true });
    await result.record.save();
    res.json(resTypes(201, { record: result.record }));
  } else res.json(resTypes(400, {}));

}

export async function removeNotification(req: Request, res: Response) {
  if (req.params.id) {
    const result = await remove(req.params.id);
    res.status(200).json(
      resTypes(200, {
        message: `notification has been removed`,
        result
      })
    );
  } else {
    res.status(404).json(
      resTypes(404, {
        message: `notification not found`,
      })
    );
  }
}

//Notification : paggination ==> done, deleteNotification ==> done,
 //changeNotificationStatus ==> done

//Chat : deleteMessage, 