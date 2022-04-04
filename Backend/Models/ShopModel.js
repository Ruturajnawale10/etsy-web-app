import mongoose from "mongoose";
const Schema = mongoose.Schema;

var shopSchema = new Schema({
    shopName: {type: String},
    shopOwner: {type: String},
    totalSales: {type: String},
    imageName: {type: String}
},
{
    versionKey: false
});

const shopModel = mongoose.model('shop', shopSchema);

export default shopModel;