import mongoose from "mongoose";
import ItemOrderModel from "./ItemOrderModel.js";
const Schema = mongoose.Schema;

var favouritesSchema = new Schema({
    userName: {type: String},
    items: {type: [ItemOrderModel.schema]},
},
{
    versionKey: false
});

const FavouritesModel = mongoose.model('favourites', favouritesSchema);

export default FavouritesModel;