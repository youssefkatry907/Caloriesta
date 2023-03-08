import db from "../../database/mongo";
import { Model, ObjectId } from "mongoose";
import { compare } from "../../utilities/encrypt";
import { genSlug } from "../../helpers/genSlug";
import { generateToken } from "../../helpers/jwt";

export interface IUser extends db.Document {
  // properties
  username?: string;
  avatar?: string;
  cover?: string;
  email: string;
  fullName: string;
  phone: string;
  bio: string;
  professionCertificate: string;
  commercialRegister: string;
  taxCard: string;
  hashedPassword: string;
  resetCode: string;
  yearsOfExperience: number;
  consultantPrice: number;
  rate: number;
  rates: Array<any>;
  addresses: Array<any>;
  programmes: ObjectId[];
  code?: string;
  gender: "male" | "female";
  isTop: boolean;
  isActive: boolean;
  isVerified: boolean;
  type:
    | "customer"
    | "nutrition"
    | "resturant"
    | "fitness"
    | "stuff"
    | "admin"
    | "delivery";
  role: object;
  industry: ObjectId;
  sliders: Array<any>;
  home?: {
    city?: ObjectId;
    region?: string;
    location?: object;
  };
  // methods
  encryptPassword(password: string): string;
  generateCode(): string;
  authenticate(string): boolean;
  info(): any;
  token(): any;
}

interface IUserInterface extends Model<IUser> {
  isExist(auth: string): Promise<IUser>;
  random(query?: object): Promise<IUser>;
  login(email: string, password: string): Promise<null | IUser>;
  isAdmin(id: ObjectId): Promise<null | IUser>;
  isConsultant(id: ObjectId): Promise<null | IUser>;
  isStaff(id: ObjectId): Promise<null | IUser>;
  isCustomer(id: ObjectId): Promise<null | IUser>;
}

export const userSchema: db.Schema<IUser> = new db.Schema(
  {
    gender: { type: String, default: "male", enum: ["male", "female"] },
    isActive: { type: Boolean, default: true },
    isTop: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    fullName: { type: String, required: true },
    bio: { type: String, required: false },
    code: { type: String, required: false },
    yearsOfExperience: { type: Number, required: false, default: 0 },
    consultantPrice: { type: Number, required: false, default: 0 },
    username: { type: String, required: false },
    resetCode: { type: String, required: false },
    avatar: { type: String, required: false },
    cover: { type: String, required: false },
    nationalId: { type: String, required: false },
    addresses: [Object],
    programmes: [{ type: db.SchemaTypes.ObjectId, ref: "Programme" }],
    professionCertificate: {
      type: String,
      required: false,
    },
    commercialRegister: {
      type: String,
      required: false,
    },
    taxCard: {
      type: String,
      required: false,
    },
    hashedPassword: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    rate: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },
    rates: [
      {
        user: { type: db.SchemaTypes.ObjectId, ref: "User", required: false },
        rate: Number,
        comment: String,
      },
    ],
    home: {
      city: { type: db.SchemaTypes.ObjectId, ref: "City", required: true },
      region: { type: String, required: false },
      location: { lat: Number, lng: Number },
      address: String,
    },
    type: {
      type: String,
      enum: [
        "customer",
        "nutrition",
        "fitness",
        "resturant",
        "stuff",
        "admin",
        "delivery",
      ],
    },
    role: { name: String, roles: [] },
    industry: {
      type: db.SchemaTypes.ObjectId,
      ref: "Industry",
      required: false,
    },
    sliders: [
      {
        cover: {
          ar: String,
          en: String,
        },
        onlyCover: { type: Boolean, default: true },
        item: { type: db.SchemaTypes.ObjectId, ref: "Meal", required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Info - white label properties
userSchema.methods.info = function (): any {
  return {
    _id: this._id,
    fullName: this.fullName,
    username: this.username,
    bio: this.bio,
    email: this.email,
    phone: this.phone,
    isActive: this.isActive,
    isVerified: this.isVerified,
    isTop: this.isTop,
    rate: this.rate,
    rates: this.rates,
    gender: this.gender,
    home: this.home,
    addresses: this.addresses,
    role: this.role,
    type: this.type,
    industry: this.industry,
    consultantPrice: this.consultantPrice,
    yearsOfExperience: this.yearsOfExperience,
    programmes: this.programmes,
    avatar: this.avatar,
    cover: this.cover,
    professionCertificate: this.professionCertificate,
    commercialRegister: this.commercialRegister,
    taxCard: this.taxCard,
  };
};
// Token - white label properties
userSchema.methods.token = function (): any {
  const token = generateToken({
    _id: this._id,
    email: this.email,
    type: this.type,
    role: this.role,
  });

  return token;
};

// auth
userSchema.methods.authenticate = async function (password) {
  return compare(password, this.hashedPassword);
};

// generateCode
userSchema.methods.generateCode = async function () {
  let count = await db.models["User"].countDocuments();

  if (this.home["city"] && this.home["region"]) {
    let city = await db.models["City"].findOne({ _id: this.home.city });
    let region = await db.models["Region"].findOne({ _id: this.home.region });
    return genSlug(city.name, region.name, count);
  }
};

// isExist auth is ( email | phone | username )
userSchema.statics.isExist = async function (auth: string): Promise<IUser> {
  return db.models["User"].findOne({
    $or: [
      { email: auth?.trim()?.toLowerCase() },
      { phone: auth?.trim()?.toLowerCase() },
      { username: auth?.trim()?.toLowerCase() },
    ],
  });
};

userSchema.statics.random = async function (query?: object) {
  const count = await this.count();
  const rand = Math.floor(Math.random() * count);
  const randomDoc = await this.find(query).skip(rand);
  return randomDoc;
};

// isExist auth is ( auth | password )
userSchema.statics.login = async function (
  auth: string,
  password: string
): Promise<null | IUser> {
  let user = await db.models["User"].findOne({
    $or: [
      { email: auth.trim().toLowerCase() },
      { phone: auth.trim().toLowerCase() },
      { username: auth.trim().toLowerCase() },
    ],
  });
  if (user) {
    const result = await user.authenticate(password, user.hashedPassword);

    return result ? user.info() : null;
  } else return null;
};

// isExist auth is ( email | phone )
userSchema.statics.isAdmin = async function (id: string): Promise<IUser> {
  return db.models["User"].findOne({
    _id: id,
    type: "admin",
  });
};
// isExist auth is ( email | phone )
userSchema.statics.isStaff = async function (id: string): Promise<IUser> {
  return db.models["User"].findOne({
    _id: id,
    type: "stuff",
  });
};
userSchema.statics.isConsultant = async function (id: string): Promise<IUser> {
  return db.models["User"].findOne({
    _id: id,
    type: "consultant",
  });
};
userSchema.statics.isCustomer = async function (id: string): Promise<IUser> {
  return db.models["User"].findOne({
    _id: id,
    type: "customer",
  });
};

// userSchema.pre<IUser>("save", async function (next) {
//   if (this.type !== "stuff" && this.type !== "admin") {
//     this.code = await this.generateCode();
//     this.username = handleUsername(this.username);
//   }
//   return next();
// });

export default db.model<IUser, IUserInterface>("User", userSchema);
