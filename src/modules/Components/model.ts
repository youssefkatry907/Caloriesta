import db from "../../database/mongo";
import { ObjectId } from "mongoose";

interface IComponent extends db.Document {
  name: string;
  code?: string;
  regions?: [ObjectId] | Array<any>;
  generateCode(): string;
}

const Component: db.Schema<IComponent> = new db.Schema(
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

    type: {
      type: String,
      enum: [
        "slider",
        "categories",
        "latestProducts",
        "newestProducts",
        "categoryProducts",
        "twoBanners",
        "singleBanner",
        "brands",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default db.model<IComponent>("Component", Component);
