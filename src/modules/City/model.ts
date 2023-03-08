import db from "../../database/mongo";

interface ICity extends db.Document {
  name: string;
  code?: string;
  cover?: string;
  phoneCode?: string;
  currency?: object;
  regions?: Array<any>;
  pointPrice?: number;
}

const City: db.Schema<ICity> = new db.Schema(
  {
    name: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      },
    },
    phoneCode: String,
    phoneLength: Number,
    code: String,
    cover: String,
    sort: Number,
    currency: {
      name: { en: String, ar: String },
      code: String,
    },
    regions: [
      {
        name: { ar: String, en: String },
        code: String,
        sort: Number || String,
      },
    ],
    pointPrice: Number
  },
  {
    timestamps: true,
  }
);

export default db.model<ICity>("City", City);
