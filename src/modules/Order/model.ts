import { ObjectId } from "mongoose";
import db from "../../database/mongo";
import { get, create } from "../Notifications/repo"

interface IOrder extends db.Document {
  code: string;
  cart: ObjectId;
  user: ObjectId;
  resturant: ObjectId;
  total: number;
  shippingAddress: {
    address: string;
    flatNo: string;
    block: string;
    street: string;
    lat: number;
    lng: number;
  };
  payment: string;
  status: 1 | 2 | 3 | 4;
}

/**
 * order status
 * 1 -------> pending
 * 2 -------> in Deliver
 * 3 -------> compeleted
 * 4 -------> canceled
 */

const Order: db.Schema<IOrder> = new db.Schema(
  {
    code: String,
    cart: { type: db.SchemaTypes.ObjectId, ref: "Cart" },
    resturant: { type: db.SchemaTypes.ObjectId, ref: "Cart" },
    user: { type: db.SchemaTypes.ObjectId, ref: "User" },
    total: Number,
    shippingAddress: {
      address: String,
      flatNo: String,
      block: String,
      street: String,
      lat: Number,
      lng: Number,
    },
    payment: String,
    status: { type: Number, enum: [1, 2, 3, 4] },
  },
  { timestamps: true }
);


Order.post('save', async (order) => {

  const form = {
    sender: order.user,
    receiver: order.resturant || order.consultant,
    message: {
      title: "New Order",
      text: `${order.user} has created a new order`
    }
  }
  
  await create(form)
})


export default db.model<IOrder>("Order", Order);
