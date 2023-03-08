import db from "../../database/mongo";
import { ObjectId } from "mongoose";

interface ISlider extends db.Document {
  name: string;
  code?: string;
  regions?: [ObjectId] | Array<any>;
  generateCode(): string;
}

const Slider: db.Schema<ISlider> = new db.Schema(
  {
    user: { type: db.SchemaTypes.ObjectId, ref: "User" },
    cover: {
      ar: String,
      en: String,
    },
    onlyCover: { type: Boolean, default: true },
    item: { type: db.SchemaTypes.ObjectId, ref: "Meal", require: false },
  },
  {
    timestamps: true,
  }
);

export default db.model<ISlider>("Slider", Slider);
