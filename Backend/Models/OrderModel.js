import mongoose from "mongoose";
const Schema = mongoose.Schema;

var orderSchema = new Schema({
    userName: {type: String},
    orderItems: {type: [Object]}
},
{
    versionKey: false
});

const orderModel = mongoose.model('order', orderSchema);

export default orderModel;