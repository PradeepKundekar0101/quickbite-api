import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  restaurantName: string;
  items: IOrderItem[];
  total: number;
  internalMargin: number;
  supplierCost: number;
  deliveryPartnerPayout: number;
  deliveryFee: number;
  status: "placed" | "preparing" | "delivering" | "delivered" | "cancelled";
  deliveryAddress: string;
  estimatedDelivery: Date;
  createdAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    restaurantName: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    internalMargin: { type: Number, default: 0 },
    supplierCost: { type: Number, default: 0 },
    deliveryPartnerPayout: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 30 },
    status: {
      type: String,
      enum: ["placed", "preparing", "delivering", "delivered", "cancelled"],
      default: "placed",
    },
    deliveryAddress: { type: String, required: true },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
