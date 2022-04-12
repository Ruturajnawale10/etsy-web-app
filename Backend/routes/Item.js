"use strict";
import express, { response } from "express";
const router = express.Router();
import Items from "../Models/ItemModel.js";
import Users from "../Models/UserModel.js";
import { checkAuth } from "../configs/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../imagesService.js";

router.get("/details", checkAuth, function (req, res, next) {
  console.log("Items overview GET Request");
  let itemName = req.query.itemName;

  Items.findOne({ itemName: itemName }, (error, item) => {
    if (error) {
      res.end("Error in fething from db");
    } else {
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

router.get("/shopdetails", checkAuth, function (req, res, next) {
  console.log("Inside shop details Request");
  let shopName = req.query.shopName;

  Items.find({ shopName: shopName }, (error, item) => {
    if (error) {
      res.end("Items fetching FAILURE");
    } else {
      Users.findOne({ "shop.shopName": shopName }, (error, user) => {
        if (user) {
          let fetched_image_name = user.shop.imageName;
          if (fetched_image_name) {
            imagesService
              .getImage(fetched_image_name)
              .then((imageData) => {
                let buf = Buffer.from(imageData.Body);
                let base64Image = buf.toString("base64");
                console.log("shop Image fetched SUCCESS");
                let userImageName = user.imageName;
                if (userImageName) {
                  imagesService
                    .getImage(userImageName)
                    .then((imageData) => {
                      let buf = Buffer.from(imageData.Body);
                      let base64Image2 = buf.toString("base64");
                      console.log("user Image fetched SUCCESS");                      
                      res.send({ items: item, image: base64Image, user: user, userImage: base64Image2 });
                    })
                    .catch((e) => {
                      res.send("Error", e.message);
                    });
                } else {
                  res.send({ items: item, image: base64Image, user: user });
                }
              })
              .catch((e) => {
                res.send("Error", e.message);
              });
          } else {
            res.status(200).send(item);
          }
        } else {
          res.send("shopname not registered");
        }
      });
    }
  });
});

export default router;
