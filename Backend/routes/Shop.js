"use strict";
import express from "express";
const router = express.Router();
import Shops from "../models/ShopModel.js";
import Items from "../models/ItemModel.js";
import Users from "../models/UserModel.js";
import { checkAuth } from "../utils/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../utils/imagesService.js";
import kafka from "../kafka/client.js";

router.get("/checkavailibility", checkAuth, function (req, res) {
  console.log("Inside check availibility GET Request");
  let shopName = req.query.shopName;

  Users.findOne({ "shop.shopName": shopName }, (error, shop) => {
    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end("Error occurred");
    } else if (shop) {
      res.status(200).send("not available");
    } else {
      res.send("available");
    }
  });
});

router.post("/createshop", checkAuth, function (req, res) {
  console.log("Inside create shop Post Request");
  let shopName = req.body.shopName;
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let userName = decoded.username;

  let shop = new Shops({
    shopName: shopName,
    shopOwner: userName,
    totalSales: 0,
  });

  Users.findOneAndUpdate(
    { username: userName },
    {
      $set: {
        shop: shop,
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

router.post("/uploadshopimage", checkAuth, async (req, res, next) => {
  console.log("Inside Upload Shop Image POST");
  const base64Image = req.body.image;
  let image_name = req.body.imageName;
  const imageName = "shop-images/" + image_name;

  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let shopOwner = decoded.username;

  try {
    let response = await imagesService.upload(imageName, base64Image);
    Users.findOneAndUpdate(
      { "shop.shopOwner": shopOwner },
      {
        "shop.imageName": imageName,
      },
      function (err, doc) {
        if (err) {
          res.end("FAILURE in updating image to document");
        } else {
          res.end("SUCCESS");
        }
      }
    );
  } catch (err) {
    console.error(`Error uploading image: ${err.message}`);
    return next(new Error(`Error uploading image: ${imageName}`));
  }
});

router.get("/", checkAuth, function (req, res) {
  console.log("inside GET Shop home");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let shopOwner = decoded.username;

  Users.findOne({ "shop.shopOwner": shopOwner }, (error, user) => {
    if (user) {
      res.status(200).send(user.shop.shopName);
    } else {
      res.send("shopname not registered");
    }
  });
});

router.get("/getitems", checkAuth, function (req, res, next) {
  console.log("Inside shop GET items Request");

  let shopName = req.query.shopName;

  Items.find({ shopName: shopName }, (error, item) => {
    if (error) {
      res.end("Items fetching FAILURE");
    } else {
      Users.findOne({ "shop.shopName": shopName }, (error, user) => {
        if (user) {
          let fetched_image_name = user.shop.imageName;
          if (fetched_image_name !== undefined) {
            imagesService
              .getImage(fetched_image_name)
              .then((imageData) => {
                let buf = Buffer.from(imageData.Body);
                let base64Image = buf.toString("base64");
                console.log("Image fetched SUCCESS");
                res.send({ items: item, image: base64Image });
              })
              .catch((e) => {
                res.send("Error", e.message);
              });
          } else {
            res.status(200).send({ items: item });
          }
        } else {
          res.send("shopname not registered");
        }
      });
    }
  });
});

router.post("/additem", checkAuth, async (req, res) => {
  console.log("Inside AddItem Post Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let username = decoded.username;
  req.body.userName = username;

  kafka("shop", req.body, function (err, item) {
    console.log("in result");
    if (err) {
      console.log("Inside err", err);
      res.end("FAILURE");
    } else {
      console.log("Inside else");
      if (item) {
        res.end("SUCCESS");
      } else {
        res.end("FAILURE");
      }
    }
  });
});

router.post("/updateitem", checkAuth, async (req, res, next) => {
  console.log("Inside Update Item Post Request");
  kafka("shop", req.body, function (err, item) {
    console.log("in result");
    if (err) {
      console.log("Inside err", err);
      res.end("FAILURE");
    } else {
      console.log("Inside else");
      if (item) {
        res.end("SUCCESS");
      } else {
        res.end("FAILURE");
      }
    }
  });
});

export default router;
