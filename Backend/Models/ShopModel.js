import mongoose from "mongoose";
const Schema = mongoose.Schema;

var shopSchema = new Schema({
    shopName: {type: String},
    shopOwner: {type: String},
    totalSales: {type: Number},
    imageName: {type: String}
},
{
    versionKey: false
});

const ShopModel = mongoose.model('shop', shopSchema);

export default ShopModel;