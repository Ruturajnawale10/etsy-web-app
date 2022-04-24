"use strict";
import Users from "../models/UserModel.js";
import imagesService from "../utils/imagesService.js";

async function handle_request(msg, callback) {
  console.log("In Kafka handle request:" + JSON.stringify(msg));
  console.log("Profile update POST Request inside kafka queue");
  let name = msg.name;
  let about = msg.about;
  let city = msg.city;
  let email = msg.email;
  let phone = msg.phone;
  let address = msg.address;
  let country = msg.country;
  let birthdate;
  if (msg.month && msg.day) {
    birthdate = `${msg.month} ${msg.day}`;
  }
  let gender = msg.gender;

  let user_id = msg.userID;

  const base64Image = msg.image;

  if (base64Image === null) {
    Users.findOneAndUpdate(
      { _id: user_id },
      {
        $set: {
          name: name,
          about: about,
          city: city,
          email: email,
          phone: phone,
          address: address,
          country: country,
          birthdate: birthdate,
          gender: gender,
        },
      },
      function (err, doc) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, "SUCCESS");
        }
      }
    );
  } else {
    try {
      const imageName = "profile-pictures/" + msg.imageName;
      let response = await imagesService.upload(imageName, base64Image);
      Users.findOneAndUpdate(
        { _id: user_id },
        {
          $set: {
            name: name,
            about: about,
            city: city,
            email: email,
            phone: phone,
            address: address,
            country: country,
            birthdate: birthdate,
            gender: gender,
            imageName: imageName,
          },
        },
        function (err, doc) {
          if (err) {
            console.log("User update failed");
            callback(err, null);
          } else {
            console.log("User updated");
            callback(null, "SUCCESS");
          }
        }
      );
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
      callback(err, null);
    }
  }
}

export default handle_request;
