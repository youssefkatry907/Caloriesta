import db from "../../database/mongo";

interface IPackage extends db.Document {
  name: string;
  code?: string;
  icon?: string;
  sort?: number;
  color?: string;
}

const Package: db.Schema<IPackage> = new db.Schema(
  {
    name: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      },
    },
    details: { ar: String, en: String },
    code: String,
    icon: String,
    color: String,
    cities: [
      {
        city: { type: db.SchemaTypes.ObjectId, ref: "City" },
        wallet: { type: Number, default: 0 },
        price: Number,
      },
    ],

    sort: Number,
  },
  {
    timestamps: true,
  }
);

export default db.model<IPackage>("Package", Package);
