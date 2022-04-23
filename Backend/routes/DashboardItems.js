"use strict";
import express from "express";
const router = express.Router();
import Items from "../models/ItemModel.js";
import Favourites from "../models/FavouritesModel.js";
import { checkAuth } from "../utils/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../utils/imagesService.js";
import kafka from "../kafka/client.js";

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
            item[i].image = images_arr[i];
          }
          res.status(200).send(item);
        })
        .catch((e) => {
          res.end("Error", e);
        });
    }
  });
});

router.post("/addtofavourites", function (req, res) {
  console.log("Inside Add to Favourites Post Request");

  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let username = decoded.username;
  req.body.userName = username;

    kafka('favourite_items', req.body, function (err, item) {
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

router.get("/checkfavourite", checkAuth, function (req, res, next) {
  console.log("Inside Check If Favourite Item GET Request");

  let itemName = req.query.itemName;
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let userName = decoded.username;

  Favourites.find(
    { userName: userName, items: { $elemMatch: { itemName: itemName } } },
    (error, items) => {
      if (error) {
        res.end("Error");
      } else {
        if (items.length > 0) {
          res.send("ITEM IS FAVOURITE");
        } else {
          res.send("ITEM IS NOT FAVOURITE");
        }
      }
    }
  );
});

router.get("/favourites", checkAuth, function (req, res, next) {
  console.log("Inside get Favourite Items GET Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let userName = decoded.username;

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

  Favourites.find({ userName: userName }, (error, favourite) => {
    if (error) {
      res.end("Error in fething from db");
    } else {
      let images_arr = [];
      let promises = [];
      for (let i = 0; i < favourite[0].items.length; i++) {
        promises.push(
          fetchImage(i, images_arr, favourite[0].items[i].imageName)
        );
      }

      Promise.all(promises)
        .then(() => {
          console.log("All images fetched successfully!");
          for (let i = 0; i < favourite[0].items.length; i++) {
            favourite[0].items[i].image = images_arr[i];
          }
          res.status(200).send(favourite[0].items);
        })
        .catch((e) => {
          res.end("Error", e);
        });
    }
  });
});

router.get("/search", function (req, res, next) {
  console.log("Inside GET SEARCHED items Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let username = decoded.username;
  let itemName = req.query.itemName;

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

  Items.find({ itemOwner: { $ne: username }, itemName: itemName }, (error, item) => {
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
            item[i].image = images_arr[i];
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
