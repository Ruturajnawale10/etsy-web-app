"use strict";
import express from "express";
const router = express.Router();
import Items from "../Models/ItemModel.js";
import { checkAuth } from "../configs/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../imagesService.js";

router.get("/getallitems", checkAuth, function (req, res) {
  console.log("Inside GET all items dashboard Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let username = decoded.username;

  function fetchImage(i, images_arr, imageName) {
    return new Promise((resolve) => {
      imagesService.getImage(imageName).then((imageData) => {
        let buf = Buffer.from(imageData.Body);
        let base64Image = buf.toString("base64");
        images_arr[i] = base64Image;
        resolve(base64Image);
      });
    });
  }

  Items.find({ itemOwner: { $ne: username } }, (error, item) => {
    if (error) {
      res.end("Error in fething from db");
    } else {
      let images_arr = [];
      let promises = [];
      for (let i = 0; i < item.length; i++) {
        promises.push(fetchImage(i, images_arr, item[i].imageName));
      }

      Promise.all(promises)
        .then(() => {
          console.log("All images fetched successfully!");
          for (let i = 0; i < item.length; i++) {
            item[i] = { ...item[i], image: images_arr[i] };
          }
          res.status(200).send(item);
        })
        .catch((e) => {
          res.end("Error", e);
        });
    }
  });
});

export default router;
