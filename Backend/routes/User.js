"use strict";
import express from "express";
const router = express.Router();
import Users from "../models/UserModel.js";
import { checkAuth } from "../utils/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../utils/imagesService.js";
import kafka from "../kafka/client.js";

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
          user.image = base64Image;
          res.status(200).send(user);
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
  console.log("Inside Profile update POST Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  req.body.userID = decoded._id;

  kafka("user", req.body, function (err, user) {
    console.log("in result");
    if (err) {
      console.log("Inside err", err);
      res.end("FAILURE");
    } else {
      console.log("Inside else");
      if (user) {
        res.end("SUCCESS");
      } else {
        res.end("FAILURE");
      }
    }
  });
});

router.post("/change/currency", checkAuth, async (req, res) => {
  console.log("Inside change currency POST Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let user_id = decoded._id;

  let user = await Users.findOneAndUpdate(
    { _id: user_id },
    {
      $set: {
        currency: req.body.currency,
      },
    }
  );

  if (user) {
    res.status(200).send();
  } else {
    res.status(400).send();
  }
});

export default router;
