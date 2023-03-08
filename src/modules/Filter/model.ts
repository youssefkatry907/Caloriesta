import db from "../../database/mongo";

interface IFilter extends db.Document {
  name: string;
}

const Filter: db.Schema<IFilter> = new db.Schema(
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
    attributes: [{ type: db.SchemaTypes.ObjectId, ref: "Attribute" }],
  },
  {
    timestamps: true,
  }
);

export default db.model<IFilter>("Filter", Filter);
