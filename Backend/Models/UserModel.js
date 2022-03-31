import mongoose from "mongoose";
const Schema = mongoose.Schema;

var usersSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String}
},
{
    versionKey: false
});
const userModel= mongoose.model('user', usersSchema);

export default userModel; 