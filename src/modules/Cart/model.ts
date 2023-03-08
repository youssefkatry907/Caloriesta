import { ObjectId } from "mongoose";
import db from "../../database/mongo";

export interface ICart extends db.Document {
  user: ObjectId;
  resturant: ObjectId | null;
  coupon: ObjectId | null;
  items: any;
  total: number;
  isLocked: boolean;
  financial: object;
  // option: {
  //   optionId: string;
  //   name: { en: string; ar: string };
  //   price: number;
  // };
  // addons: Array<{
  //   addonId: string;
  //   name: { en: string; ar: string };
  //   price: number;
  // }>;
}

const Cart: db.Schema<ICart> = new db.Schema(
  {
    user: { type: db.SchemaTypes.ObjectId, ref: "User" },
    resturant: { type: db.SchemaTypes.ObjectId, ref: "User" || null },
    payment: { type: String, enum: ["cash", "visa"] },
    coupon: { type: db.SchemaTypes.ObjectId, ref: "Coupon" || null },
    items: [
      {
        product: { type: db.SchemaTypes.ObjectId, ref: "Meal" },
        price: Number,
        quantity: Number,
        total: Number,
        option: Object,
        addons: [Object],
      },
    ],
    financial: {
      taxFees: {
        price: Number,
        type: {
          type: String,
          enum: ["fixed", "ratio"],
        },
      },
      paymentFees: { type: Number, default: 0 },
      deliveryFees: { type: Number, default: 0 },
      couponDiscount: { type: Number, default: 0 },
      totalItemsCost: { type: Number, default: 0 },
    },
    total: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default db.model<ICart>("Cart", Cart);
