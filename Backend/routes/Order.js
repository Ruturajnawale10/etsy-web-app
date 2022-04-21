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

router.post("/checkout", checkAuth, async (req, res, next) => {
  console.log("Inside Checkout POST Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let userID = decoded._id;
  let userName = decoded.username;
  let orderID = req.body.orderID;

  let date = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    Date.now()
  );

  Users.findOne({ _id: userID }, function (err, user) {
    if (err) {
      res.send("FAILURE");
    } else {
      if (!user.address) {
        res.send("FILL ADDRESS");
      } else {
        let itemNameArr = [];
        for (let i = 0; i < user.cartItems.length; i++) {
          itemNameArr.push(user.cartItems[i].itemName);
        }

        Items.find({ itemName: { $in: itemNameArr } }, function (err, item) {
          let result = [];
          let orderList = [];
          for (let i = 0; i < item.length; i++) {
            let itemOrder = new ItemOrders({
              orderID: orderID,
              itemName: item[i].itemName,
              price: item[i].price,
              quantity: user.cartItems[i].quantityRequested,
              date: date,
              imageName: item[i].imageName,
              shopName: item[i].shopName,
              isGift: user.cartItems[i].isGift
            });
            orderList.push(itemOrder);
          }

          Orders.findOneAndUpdate(
            { userName: userName },
            {
              $push: {
                orderItems: {
                  $each: orderList,
                },
              },
            },
            (error) => {
              if (error) {
                res.end("FAILURE");
              } else {
                Users.findOneAndUpdate(
                  { username: userName },
                  {
                    $set: {
                      cartItems: [],
                    },
                  },
                  function (err, doc) {
                    if (err) {
                      res.send("FAILURE");
                    } else {
                      function updateStock(item, i) {
                        return new Promise((resolve) => {
                          Items.findOneAndUpdate(
                            { itemName: item[i].itemName },
                            {
                              $set: {
                                quantity:
                                  item[i].quantity -
                                  parseInt(user.cartItems[i].quantityRequested),
                                sales: 
                                  item[i].sales +
                                  parseInt(user.cartItems[i].quantityRequested)
                              },
                            },
                            function (err, item3) {
                              if (err) {
                                res.send("FAILURE");
                              } else {
                                console.log("Updated the quantity!");
                                resolve(item3);
                              }
                            }
                          );
                        });
                      }

                      let promises = [];
                      for (let i = 0; i < item.length; i++) {
                        promises.push(updateStock(item, i));
                      }

                      Promise.all(promises)
                        .then(() => {
                          res.send("SUCCESS");
                        })
                        .catch((e) => {
                          res.send("FAILURE");
                        });
                    }
                  }
                );
              }
            }
          );
        });
      }
    }
  });
});

router.get("/history", function (req, res, next) {
  console.log("Inside GET Purchase history Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let userName = decoded.username;
  // let ord = Orders.findOne({ userName: userName, orderItems: { $slice: [2]} });
  // console.log(ord);
  Orders.findOne({ userName: userName }).slice("orderItems", -2).exec(function (err, order) {
    console.log(order);
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
