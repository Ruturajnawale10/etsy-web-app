import mongoose from "mongoose";
const Schema = mongoose.Schema;

var itemOrderSchema = new Schema({
    orderID: {type: String},
    itemName: {type: String},
    price: {type: String},
    quantity: {type: String},
    date: {type: String}
},
{
    versionKey: false
});

const itemOrderModel = mongoose.model('itemOrder', itemOrderSchema);

export default itemOrderModel;