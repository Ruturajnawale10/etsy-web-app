//import the require dependencies
import express from "express";
var app = express();
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import config from "./configs/config.js";

app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: config.localhost, credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "etsy-application",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 30* 24* 60 *60 *1000, // Overall duration of Session :  1 month
    activeduration: 30* 24* 60 *60 *1000
  })
);

app.use(express.json());

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", config.localhost);
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

mongoose.connect(config.mongo.mongoDBURL, options, (err, res) => {
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
import Order from "./routes/Order.js";

app.use("/user", Usersession);
app.use("/your", User);
app.use("/your/shop", Shop);
app.use("/items", DashboardItems);
app.use("/items", Item);
app.use("/orders", Order);

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
