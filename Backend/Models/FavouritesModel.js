import mongoose from "mongoose";
const Schema = mongoose.Schema;

var favouritesSchema = new Schema({
    userName: {type: String},
    items: {type: [Object]},
},
{
    versionKey: false
});

const favouritesModel = mongoose.model('favourites', favouritesSchema);

export default favouritesModel;