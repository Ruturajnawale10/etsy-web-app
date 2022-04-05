import mongoose from "mongoose";
const Schema = mongoose.Schema;

var itemSchema = new Schema({
    itemName: {type: String},
    shopName: {type: String},
    itemOwner: {type: String},
    category: {type: String},
    description: {type: String},
    price: {type: String},
    quantity: {type: String},
    sales: {type: String, default: 0},
    imageName: {type: String}
},
{
    versionKey: false
});

const itemModel = mongoose.model('item', itemSchema);

export default itemModel;