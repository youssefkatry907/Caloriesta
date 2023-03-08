import db from "../../database/mongo";

interface IAdmin extends db.Document {
  name: string;
}

const Admin: db.Schema<IAdmin> = new db.Schema(
  {
    name: String,
    email: String,
    password: String,
    token: String,
  },
  {
    timestamps: true,
  }
);

export default db.model<IAdmin>("Admin", Admin);
