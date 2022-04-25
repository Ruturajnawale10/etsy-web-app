import mongoose from "mongoose";
const Schema = mongoose.Schema;

var itemOrderSchema = new Schema(
  {
    orderID: { type: String },
    itemName: { type: String },
    price: { type: String },
    quantity: { type: Number },
    date: { type: Date },
    imageName: { type: String },
    shopName: { type: String },
    isGift: { type: Boolean },
    note: { type: String },
    image: { type: Object },
  },
  { _id: false },
  {
    versionKey: false,
  }
);

const ItemOrderModel = mongoose.model("itemOrder", itemOrderSchema);

export default ItemOrderModel;
