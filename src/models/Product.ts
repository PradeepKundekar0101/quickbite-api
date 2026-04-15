import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  costPrice: number;
  category: string;
  imageUrl: string;
  restaurantId: Types.ObjectId;
  supplierId: string;
  internalRating: number;
  isAvailable: boolean;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    category: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    supplierId: { type: String, default: "" },
    internalRating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });

export default mongoose.model<IProduct>("Product", productSchema);
