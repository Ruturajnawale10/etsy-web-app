//import the require dependencies
import express from "express";
var app = express();
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import { localhost } from "./configs/localhost.js";
import mongoose from "mongoose";
import config from "./configs/config_mongo.js";
const mongoDB = config.mongoDB;

app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: localhost, credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "etsy-application",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 30* 24* 60 *60 *1000, // Overall duration of Session :  1 month
  })
);

app.use(express.json());

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", localhost);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log("MongoDB connection Failed");
  } else {
    console.log("MongoDB connected");
  }
});

//Route to handle Post Request Call
import Usersession from "./routes/UserSession.js";
import User from "./routes/User.js";
import Shop from "./routes/Shop.js";
import DashboardItems from "./routes/DashboardItems.js";
import Item from "./routes/Item.js";

app.use("/user", Usersession);
app.use("/your", User);
app.use("/your/shop", Shop);
app.use("/items", DashboardItems);
app.use("/items", Item);

// app.post("/checkout", async (req, res, next) => {
//   console.log("Inside Checkout POST Request");
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;
//   let orderID = req.body.orderID;
//   //get current order date
//   var date = new Date();
//   var dd = String(date.getDate()).padStart(2, "0");
//   var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
//   var yyyy = date.getFullYear();
//   date = mm + "/" + dd + "/" + yyyy;

//   function checkoutItem(items, i, orderID, username, date) {
//     return new Promise((resolve) => {
//       let sql =
//         "insert into purchases (orderID,username,itemName,price,quantity,date) values(?,?,?,?,?,?)";
//       con.query(
//         sql,
//         [
//           orderID,
//           username,
//           items[i].itemName,
//           items[i].price,
//           items[i].quantity,
//           date,
//         ],
//         function (err, result, fields) {
//           console.log("Item added to Order List");
//           sql = "delete from cart where username=? LIMIT ?";
//           con.query(
//             sql,
//             [username, items.length + 1],
//             function (err, result, fields) {
//               console.log("Item deleted from the cart");
//               let sql =
//                 "update item set quantity = (quantity - ?), sales = (sales + ?) where itemName=?";
//               con.query(
//                 sql,
//                 [items[i].quantity, items[i].quantity, items[i].itemName],
//                 function (err, result, fields) {
//                   if (err) {
//                     console.log(err);
//                   } else {
//                   }
//                 }
//               );
//             }
//           );
//         }
//       );
//       resolve();
//     });
//   }

//   let items = req.body.items;
//   let total_items = items.length;

//   let promises = [];

//   let sql = "select address from user where username=?";
//   con.query(sql, username, function (err, result, fields) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (result[0].address === null) {
//         res.send("FILL ADDRESS");
//       } else {
//         for (let i = 0; i < total_items; i++) {
//           promises.push(checkoutItem(items, i, orderID, username, date));
//         }

//         Promise.all(promises)
//           .then(() => {
//             res.send("SUCCESS");
//           })
//           .catch((e) => {
//             // Handle errors here
//             res.send("FAILURE");
//           });
//       }
//     }
//   });
// });

// app.get("/purchasehistory", function (req, res, next) {
//   console.log("Inside GET Purchase history Request");
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;
//   let sql = "select *from purchases where username=?";
//   con.query(sql, username, function (err, result, fields) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("Items reveived");

//       function fetchImage(i, images_arr, imageName) {
//         return new Promise((resolve) => {
//           imagesService.getImage(imageName).then((imageData) => {
//             let buf = Buffer.from(imageData.Body);
//             let base64Image = buf.toString("base64");
//             images_arr[i] = base64Image;
//             resolve(base64Image);
//           });
//         });
//       }

//       let total_items = result.length;
//       //multiple fetches, use allpromise here!
//       let images_arr = [];
//       let promises = [];

//       sql =
//         "select key_image_name, shopName from item, purchases where purchases.username=? and purchases.itemName=item.itemName";
//       con.query(sql, username, function (err, result2, fields) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Image names and shop names fetched");
//           for (let i = 0; i < total_items; i++) {
//             result[i].shopName = result2[i].shopName;
//           }

//           //fetch image using image_name
//           for (let i = 0; i < total_items; i++) {
//             let imageName = result2[i].key_image_name;
//             promises.push(fetchImage(i, images_arr, imageName));
//           }

//           Promise.all(promises)
//             .then(() => {
//               for (let i = 0; i < result.length; i++) {
//                 result[i].image = images_arr[i];
//               }
//               res.send(result);
//             })
//             .catch((e) => {
//               // Handle errors here
//               res.send("FAILURE");
//             });
//         }
//       });
//     }
//   });
// });

// app.get("/search", function (req, res, next) {
//   console.log("Inside GET SEARCHED items Request");
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;
//   let itemName = req.query.itemName;

//   let sql =
//     "select itemName, price, item.key_image_name from item, user, shop where user.username!=? and user.username=shop.shopOwner and item.shopName=shop.shopName and itemName LIKE " +
//     con.escape("%" + itemName + "%");

//   function fetchImage(i, images_arr, imageName) {
//     return new Promise((resolve) => {
//       imagesService.getImage(imageName).then((imageData) => {
//         let buf = Buffer.from(imageData.Body);
//         let base64Image = buf.toString("base64");
//         images_arr[i] = base64Image;
//         resolve(base64Image);
//       });
//     });
//   }

//   con.query(sql, [username, itemName], function (err, result, fields) {
//     if (err) {
//       console.log("Data fetching failed", err.code);
//       res.send({ status: "failed" });
//     } else {
//       let images_arr = [];
//       let promises = [];
//       for (let i = 0; i < result.length; i++) {
//         promises.push(fetchImage(i, images_arr, result[i].key_image_name));
//       }

//       Promise.all(promises)
//         .then(() => {
//           console.log("All images fetched successfully!");
//           for (let i = 0; i < result.length; i++) {
//             result[i].image = images_arr[i];
//           }
//           res.send(result);
//         })
//         .catch((e) => {
//           // Handle errors here
//         });
//     }
//   });
// });

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");

export default app;
