import { resTypes } from "../helpers/responseTypes";
import { get, update, list } from "../modules/Order/repo";
import { get as getUser } from "../modules/User/repo"
import Cart from "../modules/Cart/model";
import Order from "../modules/Order/model";
import Coupon from "../modules/Coupon/model";
import { Request, Response } from "express";
import { create as createNotification } from "../modules/Notifications/repo"
import { create } from "../modules/Package/repo";

//list
export async function getUserOrders(req: Request, res: Response) {
  if (req.params.id) {
    //list user Orders
    const user: any = await getUser(req.params.id);
    if (user) {
      const orders = await list({ user: req.params.id });
      res.json(resTypes(200, orders));
    }
    else {
      res.status(401)
        .json(resTypes(401, { message: "There are no orders" }));
    }
  }
  else res.status(401).json(resTypes(401, { message: "id is missed" }));

}
//CheckOut
export async function createOrder(req: Request, res: Response) {
  const currentCart = await Cart.findOne({
    user: req["user"],
    isLocked: false,
  });

  if (currentCart) {
    const order = new Order({
      cart: currentCart._id,
      user: currentCart.user,
      resturant: currentCart.resturant,
      total: currentCart.total,
      shippingAddress: req.body.shippingAddress,
      payment: "visa",
      status: 1,
    });

    await order.save();
    currentCart.isLocked = true;
    await currentCart.save();

    res.json(
      resTypes(201, {
        record: order,
        message: "order has been cerated",
      })
    );
  } else {
    res.json(
      resTypes(404, {
        message: "user not having any cart",
      })
    );
  }
}

export async function getOrderDetails(req, res) {
  const order = await get(req.params.id);

  if (order.success) {
    res.json(
      resTypes(200, { order })
    );
  } else
    res.status(order.code).json(resTypes(order.code, { errors: order.errors }));
}

export async function updateOrderStatus(req, res) {
  if (req.params.userId && req.params.orderId && req.params.status) {
    const order = await get(req.params.orderId)
    if (order && order.record.user == req.params.userId) {
      const form = {
        status: req.params.status
      }
      const status = await update(req.params.orderId, form)
      if (status) {
        const notification = {
          sender: status.record.user,
          receiver: status.record.resturant,
          message: {
            title: "Order canceled",
            text: `${status.record.user} has canceled the order ${status.record._id}`
          }
        }
        await createNotification(notification)
        res.json(resTypes(201, { order: status.record }))
      }
    }
    else {
      res.json(resTypes(404, { errors: "No order found" }));
    }
  }
  else {
    res.json(resTypes(400, { errors: "userId, orderId and status must be entered " }));
  }
}

