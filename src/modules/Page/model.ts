import db from "../../database/mongo";

interface IPage extends db.Document {
  about: Object;
  privacy: Object;
  conditions: Object;
  refund: Object;
}

const Page: db.Schema<IPage> = new db.Schema(
  {
    about: {
      ar: String,
      en: String,
    },
    privacy: {
      ar: String,
      en: String,
    },
    conditions: {
      ar: String,
      en: String,
    },
    refund: {
      ar: String,
      en: String,
    },
  },
  {
    timestamps: true,
  }
);

export default db.model<IPage>("Page", Page);
