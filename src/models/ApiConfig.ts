import mongoose, { Schema, Document } from "mongoose";

export interface IApiConfig extends Document {
  key: string;
  value: string;
  description: string;
  isSecret: boolean;
  updatedAt: Date;
}

const apiConfigSchema = new Schema<IApiConfig>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    description: { type: String, default: "" },
    isSecret: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IApiConfig>("ApiConfig", apiConfigSchema);
