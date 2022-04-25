"use strict";
import express from "express";
const router = express.Router();
import config from "../configs/config.js";
import Users from "../models/UserModel.js";
import Favourites from "../models/FavouritesModel.js";
import Orders from "../models/OrderModel.js";
import jwt from "jsonwebtoken";
import { checkAuth } from "../utils/passport.js";
import { auth } from "../utils/passport.js";
auth();

router.post("/login", function (req, res) {
    console.log("Inside Login Post Request");
    let username = req.body.username;
    let password = req.body.password;
  
    Users.findOne({ username: username, password: password }, (error, user) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("Error occurred");
      } else if (user) {
        const payload = { _id: user._id, username: user.username };
        const token = jwt.sign(payload, config.mongo.secret, {
        });
        let JWT = "JWT " + token;
        res.status(200).send({jwt: JWT, currency: user.currency, country: user.country});
      } else {
        res.send("Invalid credentials");
      }
    });
  });

router.post("/logout", checkAuth, function (req, res) {
  console.log("Inside logout Post Request");
  const authHeader = req.headers["authorization"];
  jwt.sign(authHeader, "", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.status(200).send({ msg: "You have been Logged Out" });
    } else {
      res.send({ msg: "Error" });
    }
  });
});

router.post("/register", function (req, res) {
  console.log("Inside Register Post Request");
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  var new_user = new Users({
    username: username,
    password: password,
    email: email,
  });
  var favourites = new Favourites({
    userName: username,
    items: [],
  });
  var orders = new Orders({
    userName: username,
    orderItems: [],
  });

  Users.findOne({ username: username }, (error, user) => {
    if (error) {
      res.send("FAILURE");
    } else if (user) {
      res.send("ALREADY EXISTS");
    } else {
      new_user.save((error) => {
        if (error) {
          res.send("FAILURE");
        } else {
          favourites.save((error1) => {
            if (error1) {
              res.send("FAILURE");
            } else {
              orders.save((error2) => {
                if (error2) {
                  res.send("FAILURE");
                } else {
                  res.send("SUCCESS");
                }
              });
            }
          });
        }
      });
    }
  });
});

export default router;
