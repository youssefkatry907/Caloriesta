import { ObjectId } from "mongoose";
import db from "../../database/mongo";

interface IPointOfSale extends db.Document {
    name: string;
    country: string;
    manager: ObjectId,
    //password: string,
    address: string,
    policy: string,
    meals: Array<ObjectId>

}



const PointOfSale: db.Schema<IPointOfSale> = new db.Schema(
    {
        name: {
            ar: { type: String },
            en: { type: String },
            
        },
        country: { type: String, required: true },
        manger: { type: db.SchemaTypes.ObjectId, ref: "Admin", required: true },
        //password: { type: String, required: true },
        address: { type: String, required: true },
        policy: { type: String, required: false, default: "No Policy Defined!" },
        meals: [ { type: db.SchemaTypes.ObjectId, ref: "Meal" } ]

    },
    { timestamps: true }
);

export default db.model<IPointOfSale>("PointOfSale", PointOfSale);
