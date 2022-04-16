"use strict";
import express from "express";
const router = express.Router();
import Items from "../models/ItemModel.js";
import Users from "../models/UserModel.js";
import { checkAuth } from "../utils/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../utils/imagesService.js";

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
                      res.send({
                        items: item,
                        image: base64Image,
                        user: user,
                        userImage: base64Image2,
                      });
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

router.post("/addtocart", async (req, res, next) => {
  console.log("Inside Add to Cart POST Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let user_id = decoded._id;
  let itemName = req.body.itemName;
  let price = req.body.price;
  let quantityRequested = req.body.quantityRequested;

  Users.findOneAndUpdate(
    { _id: user_id },
    {
      $push: {
        cartItems: {
          itemName: itemName,
          quantityRequested: quantityRequested,
        },
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
});

router.get("/getcartitems", function (req, res, next) {
  console.log("Cart items GET Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let user_id = decoded._id;

  Users.findOne({ _id: user_id }, function (err, user) {
    if (err) {
      res.send("FAILURE");
    } else {
      let itemNameArr = [];
      for (let i = 0; i < user.cartItems.length; i++) {
        itemNameArr.push(user.cartItems[i].itemName);
      }

      Items.find({ itemName: { $in: itemNameArr } }, function (err, item) {
        let result = [];
        for (let i = 0; i < item.length; i++) {
          result.push({
            itemName: user.cartItems[i].itemName,
            quantityRequested: user.cartItems[i].quantityRequested,
            price: item[i].price,
            quantity: item[i].quantity,
          });
        }
        res.send(result);
      });
    }
  });
});

router.post("/removefromcart", function (req, res) {
  console.log("Remove items POST Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let user_id = decoded._id;
  let itemName = req.body.itemName;

  Users.findOneAndUpdate(
    { _id: user_id },
    {
      $pull: { cartItems: { itemName: itemName } },
    },
    (error, item) => {
      if (error) {
        res.status(500).send();
      } else {
        res.status(200).send();
      }
    }
  );
});

router.post("/change/quantity", function (req, res) {
  console.log("Change items quantity POST Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let user_id = decoded._id;
  let itemName = req.body.itemName;
  let newQuantity = req.body.newQuantity;

  Users.findOneAndUpdate(
    { _id: user_id },
    {
      $pull: { cartItems: { itemName: itemName } },
    },
    (error, item) => {
      if (error) {
        res.status(500).send();
      } else {
        Users.findOneAndUpdate(
          { _id: user_id },
          {
            $push: {
              cartItems: {
                itemName: itemName,
                quantityRequested: newQuantity,
              },
            },
          },
          (error, item) => {
            if (error) {
              res.status(500).send();
            } else {
              res.status(200).send();
            }
          }
        );
        res.status(200).send();
      }
    }
  );
});

export default router;
