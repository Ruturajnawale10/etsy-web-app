import mongoose from "mongoose";
const Schema = mongoose.Schema;
import ItemOrderModel from "./ItemOrderModel.js";

var orderSchema = new Schema({
    userName: {type: String},
    orderItems: {type: [ItemOrderModel.schema]}
},
{
    versionKey: false
});

const OrderModel = mongoose.model('order', orderSchema);

export default OrderModel;