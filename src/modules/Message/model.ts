import db from "../../database/mongo";

interface IMessage extends db.Document {
  about: Object;
  privacy: Object;
  conditions: Object;
  refund: Object;
}

const Message: db.Schema<IMessage> = new db.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default db.model<IMessage>("Message", Message);
