import db from "../../database/mongo";

interface ICoupon extends db.Document {
  code: string;
  startDate: string;
  endDate: string;
  count: number;
  discount: number;
  discountType: string;
  cover: string;
  isActive: boolean;
  minOrder: number;
}

const Coupon: db.Schema<ICoupon> = new db.Schema(
  {
    code: String,
    startDate: String,
    endDate: String,
    count: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ["fixed", "ratio"] },
    cover: String,
    isActive: { type: Boolean, default: false },
    minOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default db.model<ICoupon>("Coupon", Coupon);
