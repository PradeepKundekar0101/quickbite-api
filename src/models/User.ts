import mongoose, { Schema, Document } from "mongoose";

interface IAddress {
  label: string;
  street: string;
  city: string;
  zipCode: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  internalCreditScore: number;
  accountFlags: string[];
  lastLoginIp: string;
  addresses: IAddress[];
  role: "user" | "admin";
  createdAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    internalCreditScore: { type: Number, default: 500 },
    accountFlags: { type: [String], default: [] },
    lastLoginIp: { type: String, default: "" },
    addresses: { type: [addressSchema], default: [] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
