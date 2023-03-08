import db from "../../database/mongo";

interface IIndustry extends db.Document {
  name: string;
  code?: string;
  cover?: string;
  sort?: number;
}

const Industry: db.Schema<IIndustry> = new db.Schema(
  {
    name: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      },
    },
    code: String,
    cover: String,
    isNutrition: { type: Boolean, default: false },
    isIndividual: { type: Boolean, default: true },
    sort: Number,
  },
  {
    timestamps: true,
  }
);

export default db.model<IIndustry>("Industry", Industry);
