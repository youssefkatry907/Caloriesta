import db from "../../database/mongo";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { ObjectId } from "mongoose";

interface IMeal extends db.Document {
  name: string;
  code?: string;
  category?: ObjectId;
  resturant?: ObjectId;
  type?: string;
  description: object;
  image?: string;
  offerCover?: string;
  rate?: number;
  rates?: Array<any>;
  isInstant: boolean;
  
}

const Meal: db.Schema<IMeal> = new db.Schema(
  {
    resturant: { type: db.SchemaTypes.ObjectId, ref: "User" },
    name: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      },
    },
    stringQuery: String,
    description: {
      ar: String,
      en: String,
    },
    category: {
      type: db.SchemaTypes.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "other"],
      default: "other",
    },
    sku: String,
    weight: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "at least zero"],
    },
    hints: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    image: String,
    offerCover: String,
    price: { type: Number, default: 1 },
    finalPrice: { type: Number, default: 1 },
    discount: {
      type: { type: String, enum: ["ratio", "fixed", "noDiscount"] },
      value: Number,
    },
    addons: [
      {
        name: { ar: String, en: String },
        price: { type: Number, default: 1 },
      },
    ],
    options: [
      {
        name: { ar: String, en: String },
        price: { type: Number, default: 1 },
      },
    ],
    rates: [
      {
        user: { type: db.SchemaTypes.ObjectId, ref: "User" },
        rate: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
        comment: String,
      },
    ],
    country: { type: String, required: [true, "Country is required"], default: "Egypt" },
    
    rate: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
    isActive: { type: Boolean, default: true },
    isInstant: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

Meal.plugin(aggregatePaginate);

export default db.model<IMeal>("Meal", Meal);
