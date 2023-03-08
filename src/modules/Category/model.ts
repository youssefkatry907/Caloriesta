import db from "../../database/mongo";
import { ObjectId } from "mongoose";

interface ICategory extends db.Document {
  name: string;
  cover: string;
  banner: string;
  code?: string;
  sort?: number;
  isActive?: boolean;
  isParent?: boolean;
  parent?: ObjectId;
  subCategories?: [ObjectId] | Array<any>;
}

const Category: db.Schema<ICategory> = new db.Schema(
  {
    name: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      },
    },
    cover: String,
    banner: {
      ar: String,
      en: String,
    },
    sort: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isParent: { type: Boolean, default: false },
    parent: { type: db.SchemaTypes.ObjectId, ref: "Category" },
    subCategories: [{ type: db.SchemaTypes.ObjectId, ref: "Category" }],
  },
  {
    timestamps: true,
  }
);

export default db.model<ICategory>("Category", Category);
