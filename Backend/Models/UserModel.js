import mongoose from "mongoose";
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
    shop: {type: Object},
    cartItems: {type: [Object]},
    currency: {type: String, default: "$ (USD)"}
},
{
    versionKey: false
});
const UserModel= mongoose.model('user', usersSchema);

export default UserModel; 