import db from "../../database/mongo";
import { ObjectId } from "mongoose";

export interface IAttribute extends db.Document {
  name: string;
  sort: string;
  filter: ObjectId;
}

const AttributeSchema: db.Schema<IAttribute> = new db.Schema(
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
    sort: Number,
    filter: { type: db.SchemaTypes.ObjectId, ref: "Filter", required: false },
  },
  {
    timestamps: true,
  }
);

export default db.model<IAttribute>("Attribute", AttributeSchema);
