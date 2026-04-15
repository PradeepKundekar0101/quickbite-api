import mongoose, { Schema, Document, Types } from "mongoose";

interface IMenuItem {
  productId: Types.ObjectId;
}

export interface IRestaurant extends Document {
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  address: string;
  isOpen: boolean;
  imageUrl: string;
  commissionRate: number;
  internalHealthScore: number;
  complianceNotes: string;
  menu: IMenuItem[];
  createdAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { _id: false }
);

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 4.0 },
    deliveryTime: { type: String, default: "30-40 min" },
    address: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
    imageUrl: { type: String, default: "" },
    commissionRate: { type: Number, default: 0.2 },
    internalHealthScore: { type: Number, default: 80 },
    complianceNotes: { type: String, default: "" },
    menu: { type: [menuItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
