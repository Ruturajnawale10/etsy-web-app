"use strict";
import express from "express";
const router = express.Router();
import Users from "../Models/UserModel.js";
import { checkAuth } from "../configs/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../imagesService.js";

router.get("/profile", checkAuth, async (req, res) => {
  console.log("Inside Profile GET Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let user_id = decoded._id;

  Users.findOne({ _id: user_id }, (error, user) => {
    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Error occurred");
    } else if (user) {
      if (user.imageName) {
        imagesService.getImage(user.imageName).then((imageData) => {
          let buf = Buffer.from(imageData.Body);
          let base64Image = buf.toString("base64");
          console.log("Data fetched successful");
          user._doc = {...user._doc, image: base64Image};
          res.status(200).send(user._doc);
        });
      } else {
        res.status(200).send(user);
      }
    } else {
      res.send("FAILURE");
    }
  });
});

router.post("/profile", checkAuth, async (req, res, next) => {
  console.log("Inside Profile POST Request");

  let name = req.body.name;
  let about = req.body.about;
  let city = req.body.city;
  let email = req.body.email;
  let phone = req.body.phone;
  let address = req.body.address;
  let country = req.body.country;
  let birthdate;
  if (req.body.month && req.body.day) {
    birthdate = `${req.body.month} ${req.body.day}`;
  }
  let gender = req.body.gender;

  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let user_id = decoded._id;

  const base64Image = req.body.image;

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
          res.send("FAILURE");
        } else {
          res.send("SUCCESS");
        }
      }
    );
  } else {
    try {
      const imageName = "profile-pictures/" + req.body.imageName;
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
          } else {
            console.log("User updated");
            res.end("SUCCESS");
          }
        }
      );
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
      return next(new Error(`Error uploading image: ${req.body.imageName}`));
    }
  }
});

export default router;
