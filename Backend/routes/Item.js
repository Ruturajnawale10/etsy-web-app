"use strict";
import express, { response } from "express";
const router = express.Router();
import Items from "../Models/ItemModel.js";
import { checkAuth } from "../configs/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../imagesService.js";

router.get("/details", checkAuth, function (req, res, next) {
  console.log("Items overview GET Request");
  let itemName = req.query.itemName;
  let sql = "select *from item where itemName=?";

  Items.findOne({ itemName: itemName }, (error, item) => {
    if (error) {
      res.end("Error in fething from db");
    } else {
      console.log("Name is ");
      console.log(item);

      if (item.imageName) {
        imagesService
          .getImage(item.imageName)
          .then((imageData) => {
            let buf = Buffer.from(imageData.Body);
            let base64Image = buf.toString("base64");
            console.log("Data fetched successful");
            item._doc.image = base64Image;
            res.send(item);
          })
          .catch((e) => {
            res.send(item);
          });
      } else {
          res.send(item);
      }
    }
  });
});

export default router;
