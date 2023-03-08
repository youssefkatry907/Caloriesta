import { ObjectId } from "mongoose";
import db from "../../database/mongo";

/**
 * title = loss 50 kilo in 30 day
 * days = 30
 * description = loss 50 kil0 in 30 day without any tools
 * details [
 *  {
 *    day: Day 1,
 *    categories: [
 *      {name: BreakFast, details: Drink 2 liter of water }
 *      {name: Dinner, details: Drink 1/2 liter water }
 *    ]
 *  }
 * ]
 */
interface IProgramme extends db.Document {
  code: string;
  days: string;
  price: number;
  purchasesCount: number;
  cover: string;
  isActive: boolean;
  user: ObjectId;
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  details: [
    {
      day: string;
      categories: [{ name: string; details: string }];
    }
  ];
  file: string;
}

const Programme: db.Schema<IProgramme> = new db.Schema(
  {
    user: { type: db.SchemaTypes.ObjectId, ref: "User" },
    title: {
      en: String,
      ar: String,
    },
    description: {
      en: String,
      ar: String,
    },
    details: [
      {
        day: String,
        categories: [{ name: String, details: String }],
      },
    ],
    code: String,
    days: String,
    price: { type: Number, default: 0 },
    purchasesCount: { type: Number, default: 0 },
    cover: String,
    file: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default db.model<IProgramme>("Programme", Programme);
