import mongoose from "mongoose";
import { Object } from "mongoose/lib/schema/index.js";
const Schema = mongoose.Schema;

var usersSchema = new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    name: {type: String},
    about: {type: String},
    city: {type: String},
    email: {type: String},
    phone: {type: String},
    address: {type: String},
    country: {type: String},
    birthdate: {type: String},
    gender: {type: String},
    imageName: {type: String},
    shop: {type: Object}
},
{
    versionKey: false
});
const userModel= mongoose.model('user', usersSchema);

export default userModel; 