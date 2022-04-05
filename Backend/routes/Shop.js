"use strict";
import express from "express";
const router = express.Router();
import Shops from "../Models/ShopModel.js";
import Items from "../Models/ItemModel.js";
import Users from "../Models/UserModel.js";
import { checkAuth } from "../configs/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../imagesService.js";

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
        shop: shop
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
  console.log(shopName);

  Items.find({shopName: shopName}, (error, item) => {
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
                    console.log("Image fetched SUCCESS");
                    res.send({items: item, image: base64Image});
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

router.post("/additem", checkAuth, async (req, res) => {
  console.log("Inside AddItem Post Request");
  let itemName = req.body.itemName;
  let shopName = req.body.shopName;
  let category = req.body.category;
  let description = req.body.description;
  let price = req.body.price;
  let quantity = req.body.quantity;
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let username = decoded.username; 
  let imageName = req.body.imageName;
  const base64Image = req.body.image;
  imageName = `items/${imageName}`;

  try {
    let response = await imagesService.upload(imageName, base64Image);

    let item = new Items({
        itemName: itemName,
        shopName: shopName,
        itemOwner: username,
        category: category,
        description: description,
        price: price,
        quantity: quantity,
        imageName: imageName
    });
    item.save(item, (error, shop) => {
      if (item) {
        res.send("SUCCESS");
      } else {
        res.send("FAILURE");
      }
    });
  } catch (err) {
    console.error(`Error uploading image: ${err.message}`);
    res.end("complete");
  }
});

router.post("/updateitem", checkAuth, async (req, res, next) => {
  console.log("Inside Update Item Post Request");
  let itemName = req.body.itemName;
  let category = req.body.category;
  let description = req.body.description;
  let price = req.body.price;
  let quantity = req.body.quantity;

  let imageName = req.body.imageName;
  const base64Image = req.body.image;
  imageName = `items/${imageName}`;
  
  if (base64Image === null) {
    console.log("Updating...");
    Items.findOneAndUpdate(
      { itemName: itemName },
      {
        $set: {
          category: category,
          description: description,
          price: price,
          quantity: quantity
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
      const imageName = "items/" + req.body.imageName;
      let response = await imagesService.upload(imageName, base64Image);
      Items.findOneAndUpdate(
        { itemName: itemName },
        {
          $set: {
            category: category,
            description: description,
            price: price,
            quantity: quantity,
            imageName: imageName
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
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
      return next(new Error(`Error uploading image: ${req.body.imageName}`));
    }
  }
});

export default router;
