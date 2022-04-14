"use strict";
import express, { response } from "express";
const router = express.Router();
import Items from "../Models/ItemModel.js";
import ItemOrders from "../Models/ItemOrderModel.js";
import Orders from "../Models/OrderModel.js";
import Users from "../Models/UserModel.js";
import { checkAuth } from "../configs/passport.js";
import jwtDecode from "jwt-decode";

router.post("/checkout", checkAuth, async (req, res, next) => {
  console.log("Inside Checkout POST Request");
  let token = req.headers.authorization;
  var decoded = jwtDecode(token.split(" ")[1]);
  let userID = decoded._id;
  let userName = decoded.username;
  let orderID = req.body.orderID;

  //get current order date
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = date.getFullYear();
  date = mm + "/" + dd + "/" + yyyy;

  let items = req.body.items;
  let total_items = items.length;

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
          console.log(item);
          let result = [];
          let orderList = [];
          for (let i = 0; i < item.length; i++) {
            let itemOrder = new ItemOrders({
              orderID: orderID,
              itemName: item[i].itemName,
              price: item[i].price,
              quantity: item[i].quantity,
              date: date,
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
                      res.send("SUCCESS");
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

export default router;
