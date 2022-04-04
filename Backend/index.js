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
    duration: 2629800000, // Overall duration o f Session :  1 month
    activeDuration: 2629800000,
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

app.use("/user", Usersession);
app.use("/your", User);
app.use("/your/shop", Shop);

// app.post("/additem", async (req, res, next) => {
//   console.log("Inside AddItem Post Request");
//   let item_name = req.body.item_name;
//   let shop_name = req.body.shop_name;
//   let category = req.body.category;
//   let description = req.body.description;
//   let price = req.body.price;
//   let quantity = req.body.quantity;

//   let imageName = req.body.imageName;
//   const base64Image = req.body.image;
//   const key_image_name = `items/${imageName}`;
//   let response;

//   try {
//     response = await imagesService.upload(key_image_name, base64Image);

//     let sql =
//       "insert into item (item_name, shop_name, category, description, price, quantity, key_image_name) values(?,?,?,?,?,?,?)";
//     con.query(
//       sql,
//       [
//         item_name,
//         shop_name,
//         category,
//         description,
//         price,
//         quantity,
//         key_image_name,
//       ],
//       function (err, result, fields) {
//         if (err) {
//           console.log("Insertion failed");
//         } else {
//           console.log("1 record inserted");
//         }
//       }
//     );
//   } catch (err) {
//     console.error(`Error uploading image: ${err.message}`);
//     return next(new Error(`Error uploading image: ${imageName}`));
//   }
//   res.end("complete");
// });

// app.post("/updateitem", async (req, res, next) => {
//   console.log("Inside Update Item Post Request");
//   let item_name = req.body.item_name;
//   let category = req.body.category;
//   let description = req.body.description;
//   let price = req.body.price;
//   let quantity = req.body.quantity;

//   let imageName = req.body.imageName;
//   const base64Image = req.body.image;
//   const key_image_name = `items/${imageName}`;
//   let response;

//   let sql = "update item set ";
//   let update_arr = [];

//   if (category != null) {
//     update_arr.push(category);
//     sql += "category=?,";
//   }
//   if (description != null) {
//     update_arr.push(description);
//     sql += "description=?,";
//   }
//   if (price != null) {
//     update_arr.push(price);
//     sql += "price=?,";
//   }
//   if (quantity != null) {
//     update_arr.push(quantity);
//     sql += "quantity=?,";
//   }

//   sql = sql.slice(0, -1);
//   sql += " where item_name=?";
//   update_arr.push(item_name);

//   if (update_arr.length <= 1) {
//     res.end("No update");
//   }

//   con.query(sql, update_arr, function (err, result, fields) {
//     if (err) {
//       console.log("Updation failed");
//     } else {
//       res.end("SUCCESS");
//     }
//   });
// });

// app.get("/shopdetails", function (req, res, next) {
//   console.log("Inside shop details Request");

//   let shop_name = req.query.shopName;
//   console.log(shop_name);
//   let sql = "select item_name,sales from item where shop_name=?";
//   con.query(sql, shop_name, function (err, result, fields) {
//     if (err) {
//       console.log("Data fetching failed");
//       res.send({ status: "failed" });
//     } else {
//       let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;

//       sql = "select key_image_name from shop where shop_name=?";
//       con.query(sql, shop_name, function (err, result2, fields) {
//         if (err) {
//           console.log("Data fetching failed");
//         } else {
//           let fetched_image_name = result2[0].key_image_name;
//           if (fetched_image_name != null) {
//             imagesService
//               .getImage(fetched_image_name)
//               .then((imageData) => {
//                 let buf = Buffer.from(imageData.Body);
//                 let base64Image = buf.toString("base64");
//                 result[0].image = base64Image;
//                 result[0].username = username;
//                 console.log("Image fetched SUCCESS");
//                 res.send(result);
//               })
//               .catch((e) => {
//                 res.send(result);
//               });
//           } else {
//             console.log("shop image not yet set");
//             //result[0].image = null;
//             res.send(result);
//           }
//         }
//       });
//     }
//   });
// });

// app.get("/getallitems", function (req, res, next) {
//   console.log("Inside GET all items dashboard Request");
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;
//   let sql =
//     "select item_name, price, item.key_image_name from item, user, shop where user.username!=? and user.username=shop.shop_owner and item.shop_name=shop.shop_name";

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

//   con.query(sql, username, function (err, result, fields) {
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
//           res.status(200).send(result);
//         })
//         .catch((e) => {
//           // Handle errors here
//         });
//     }
//   });
// });

// app.post("/addtofavourites", function (req, res) {
//   console.log("Inside Add to Favourites Post Request");
//   let item_name = req.body.item_name;
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;

//   let sql = "select *from favourites where item_name=? and username=?";

//   con.query(sql, [item_name, username], function (err, result, fields) {
//     if (err) {
//       console.log("FAILURE in fetching details");
//     } else {
//       if (result.length === 0) {
//         //no favourite record found, so add it
//         sql = "insert into favourites(item_name,username) values(?,?)";
//         con.query(sql, [item_name, username], function (err, result, fields) {
//           if (err) {
//             console.log("FAILURE in inserting to favourites");
//           } else {
//             res.send("SUCCESS");
//           }
//         });
//       } else {
//         //favourite was already present. So toggle it and unfavourite
//         sql = "delete from favourites where item_name=? and username=?";
//         con.query(sql, [item_name, username], function (err, result, fields) {
//           if (err) {
//             console.log("FAILURE to remove fro favourites");
//           } else {
//             res.send("SUCCESS");
//           }
//         });
//       }
//     }
//   });
// });

// app.get("/checkfavourite", function (req, res, next) {
//   console.log("Inside Check If Favourite Item GET Request");

//   let item_name = req.query.item_name;
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;

//   let sql = "select *from favourites where item_name=? and username=?";
//   con.query(sql, [item_name, username], function (err, result, fields) {
//     if (err) {
//       console.log("Data fetching failed");
//       res.send({ status: "failed" });
//     } else {
//       if (result.length === 1) {
//         res.send("IS FAVOURITE");
//       } else {
//         res.send("NOT FAVOURITE");
//       }
//     }
//   });
// });

// app.get("/getfavouriteitems", function (req, res, next) {
//   console.log("Inside get Favourite Items GET Request");

//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;
//   let sql =
//     "select favourites.item_name, item.price, item.key_image_name from item, favourites where favourites.username=? and favourites.item_name=item.item_name";

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

//   con.query(sql, username, function (err, result, fields) {
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

// app.get("/itemdetails", function (req, res, next) {
//   console.log("Items overview GET Request");
//   let item_name = req.query.item_name;
//   let sql = "select *from item where item_name=?";
//   con.query(sql, item_name, function (err, result, fields) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//       let fetched_image_name = result[0].key_image_name;
//       if (fetched_image_name !== null) {
//         imagesService
//           .getImage(fetched_image_name)
//           .then((imageData) => {
//             let buf = Buffer.from(imageData.Body);
//             let base64Image = buf.toString("base64");
//             result[0].image = base64Image;
//             console.log("Data fetched successful");
//             res.send(result);
//           })
//           .catch((e) => {
//             res.send(result);
//           });
//       } else {
//         res.send(result);
//       }
//     }
//   });
// });

// app.post("/addtocart", async (req, res, next) => {
//   console.log("Inside Add to Cart POST Request");
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;
//   let item_name = req.body.itemName;
//   let price = req.body.price;
//   let quantityRequested = req.body.quantityRequested;

//   let sql =
//     "insert into cart (item_name,price,quantity,username) values(?,?,?,?)";
//   con.query(
//     sql,
//     [item_name, price, quantityRequested, username],
//     function (err, result, fields) {
//       if (err) {
//         res.send("FAILURE");
//       } else {
//         res.send("SUCCESS");
//       }
//     }
//   );
// });

// app.get("/getcartitems", function (req, res, next) {
//   console.log("Cart items GET Request");
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;

//   let sql = "select *from cart where username=?";
//   con.query(sql, username, function (err, result, fields) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

// app.post("/checkout", async (req, res, next) => {
//   console.log("Inside Checkout POST Request");
//   let token = 
//req.headers.authorization;
  //var decoded = jwtDecode(token.split(" ")[1]);
//  let user_id = decoded._id;
//   let order_id = req.body.order_id;
//   //get current order date
//   var date = new Date();
//   var dd = String(date.getDate()).padStart(2, "0");
//   var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
//   var yyyy = date.getFullYear();
//   date = mm + "/" + dd + "/" + yyyy;

//   function checkoutItem(items, i, order_id, username, date) {
//     return new Promise((resolve) => {
//       let sql =
//         "insert into purchases (order_id,username,item_name,price,quantity,date) values(?,?,?,?,?,?)";
//       con.query(
//         sql,
//         [
//           order_id,
//           username,
//           items[i].item_name,
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
//                 "update item set quantity = (quantity - ?), sales = (sales + ?) where item_name=?";
//               con.query(
//                 sql,
//                 [items[i].quantity, items[i].quantity, items[i].item_name],
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
//           promises.push(checkoutItem(items, i, order_id, username, date));
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
//         "select key_image_name, shop_name from item, purchases where purchases.username=? and purchases.item_name=item.item_name";
//       con.query(sql, username, function (err, result2, fields) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log("Image names and shop names fetched");
//           for (let i = 0; i < total_items; i++) {
//             result[i].shop_name = result2[i].shop_name;
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
//   let item_name = req.query.itemName;

//   let sql =
//     "select item_name, price, item.key_image_name from item, user, shop where user.username!=? and user.username=shop.shop_owner and item.shop_name=shop.shop_name and item_name LIKE " +
//     con.escape("%" + item_name + "%");

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

//   con.query(sql, [username, item_name], function (err, result, fields) {
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
