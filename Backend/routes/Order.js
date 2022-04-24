"use strict";
import express from "express";
const router = express.Router();
import Items from "../models/ItemModel.js";
import ItemOrders from "../models/ItemOrderModel.js";
import Orders from "../models/OrderModel.js";
import Users from "../models/UserModel.js";
import { checkAuth } from "../utils/passport.js";
import jwtDecode from "jwt-decode";
import imagesService from "../utils/imagesService.js";
import kafka from "../kafka/client.js";

router.post("/checkout", checkAuth, async (req, res, next) => {
  console.log("Inside Checkout POST Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  req.body.userID = decoded._id;
  req.body.userName = decoded.username;
  req.body.orderID = req.body.orderID;

  kafka("checkout", req.body, function (err, result) {
    console.log("in result");
    if (err) {
      console.log("Inside err", err);
      res.end("FAILURE");
    } else {
      console.log("Inside else");
      if (result === "SUCCESS") {
        res.end("SUCCESS");
      } else if (result === "FILL ADDRESS") {
        res.send(result);
      } else {
        res.send(result);
      }
    }
  });
});

router.get("/history", function (req, res, next) {
  console.log("Inside GET Purchase history Request");
  let pageNum = parseInt(req.query.pageNum);
  let pageSize = parseInt(req.query.pageSize);
  let numbersToSkip = (pageNum - 1) * pageSize;
  let numbersToReturn = pageSize;

  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let userName = decoded.username;

  Orders.findOne({ userName: userName })
    .slice("orderItems", numbersToSkip, numbersToReturn)
    .exec(function (err, order) {
      if (err) {
        res.send("FAILURE");
      } else {
        console.log("Order Items received.");

        function fetchImage(i, imageName) {
          return new Promise((resolve) => {
            imagesService.getImage(imageName).then((imageData) => {
              let buf = Buffer.from(imageData.Body);
              let base64Image = buf.toString("base64");
              order.orderItems[i].image = base64Image;
              resolve(base64Image);
            });
          });
        }

        let total_items = order.orderItems.length;

        //multiple fetches, use allpromise here!
        let promises = [];
        //fetch image using image_name
        for (let i = 0; i < total_items; i++) {
          let imageName = order.orderItems[i].imageName;
          promises.push(fetchImage(i, imageName));
        }

        Promise.all(promises)
          .then(() => {
            res.send(order.orderItems);
          })
          .catch((e) => {
            res.send("FAILURE");
          });
      }
    });
});

export default router;
