import db from "../../database/mongo";
import { ObjectId } from "mongoose";

interface IBrand extends db.Document {
  name: string;
  code?: string;
  regions?: [ObjectId] | Array<any>;
}

const Brand: db.Schema<IBrand> = new db.Schema(
  {
    admin: { type: db.SchemaTypes.ObjectId, ref: "Admin" },
    name: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      },
    },
    slug: String,
    stringQuery: String,
    cover: String,
    sort: Number,
  },
  {
    timestamps: true,
  }
);

export default db.model<IBrand>("Brand", Brand);
