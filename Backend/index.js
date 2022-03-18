//import the require dependencies
import express from "express";
var app = express();
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import mysql from "mysql";
import config_rds from "./configs/config_rds.js";
import imagesService from "./imagesService.js";

app.use(cookieParser());
app.set("view engine", "ejs");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//use express session to maintain session data
app.use(
  session({
    secret: "etsy-application",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  })
);

app.use(express.json());

//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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

//create Amazon RDS mysql connection
var con = mysql.createConnection(config_rds);

//connection to mysql
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  //let sql = "select *from user";
  con.query("select *from user", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});

//Route to handle Post Request Call
app.post("/login", function (req, res) {
  console.log("Inside Login Post Request");
  let username = req.body.username;
  let password = req.body.password;

  let sql = "select * from user where username = ? AND password = ?";
  con.query(sql, [username, password], function (err, result, fields) {
    if (result.length === 0) {
      console.log("Invalid credentials");
      res.end("Invalid credentials");
    } else {
      console.log("User verified!");
      res.cookie("cookie", "admin", {
        maxAge: 1920000,
        httpOnly: false,
        path: "/",
      });
      res.cookie("username", username);
      req.session.user = result;
      res.end("Successful Login");
    }
  });
});

app.post("/register", function (req, res) {
  console.log("Inside Register Post Request");
  console.log("Req Body : ", req.body);
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;

  let sql = "insert into user (username, email, password) values(?, ?, ?)";
  con.query(sql, [username, email, password], function (err, result, fields) {
    if (err) {
      console.log("Username already exists!");
    } else {
      console.log("1 record inserted");
      res.end("user registered successfully");
    }
  });
});

app.post("/logout", function (req, res) {
  console.log("Inside logout Post Request");
  res.status(200).clearCookie("cookie", {
    path: "/",
  });
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

app.get("/profile", async (req, res, next) => {
  console.log("Inside Profile GET Request");
  let username = req.cookies.username;
  let sql = "select *from user where username=?";
  con.query(sql, username, function (err, result, fields) {
    if (err) {
      console.log("Data fetching failed");
    } else {
      let fetched_image_name = result[0].key_image_name;
      if (fetched_image_name !== null) {
        imagesService
          .getImage(fetched_image_name)
          .then((imageData) => {
            let buf = Buffer.from(imageData.Body);
            let base64Image = buf.toString("base64");
            result[0].image = base64Image;
            console.log("Data fetched successful");
            res.send(result);
          })
          .catch((e) => {
            res.send(result);
          });
      } else {
        res.send(result);
      }
    }
  });
});

app.post("/profile", async (req, res, next) => {
  console.log("Inside Profile POST Request");
  console.log("Req Body : ", req.body);

  let name = req.body.name;
  let about = req.body.about;
  let city = req.body.city;
  let email = req.body.email;
  let phone = req.body.phone;
  let address = req.body.address;
  let country = req.body.country;
  let birthdate;
  if (req.body.month !== null && req.body.day !== null) {
    birthdate = `${req.body.month} ${req.body.day}`;
  } else {
    birthdate = req.body.birthdate;
  }
  let gender = req.body.gender;

  let username = req.cookies.username;

  const base64Image = req.body.image;
  let response;

  if (base64Image === null) {
    let sql =
      "update user set name=?,about=?,city=?,email=?,phone=?,address=?,country=?,birthdate=?,gender=? where username=?";
    con.query(
      sql,
      [
        name,
        about,
        city,
        email,
        phone,
        address,
        country,
        birthdate,
        gender,
        username,
      ],
      function (err, result, fields) {
        if (err) {
          console.log("Updation failed");
        } else {
          console.log("1 record updated");
        }
      }
    );
  } else {
    try {
      const imageName = "profile-pictures/" + req.body.imageName;
      response = await imagesService.upload(imageName, base64Image);

      let sql =
        "update user set name=?,about=?,city=?,email=?,phone=?,address=?,country=?,birthdate=?,gender=?,key_image_name=? where username=?";
      con.query(
        sql,
        [
          name,
          about,
          city,
          email,
          phone,
          address,
          country,
          birthdate,
          gender,
          imageName,
          username,
        ],
        function (err, result, fields) {
          if (err) {
            console.log("Updation failed");
          } else {
            console.log("1 record updated");
          }
        }
      );
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
      return next(new Error(`Error uploading image: ${imageName}`));
    }
  }
  res.end("complete");
});

app.get("/checkavailibility", function (req, res) {
  let shopname = req.query.shopName;
  console.log("Shop name received in backend is:");
  console.log(shopname);

  let sql = "select *from shop where shop_name=?";
  con.query(sql, shopname, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("Pass");
    }

    console.log(result);
    if (result.length === 0) {
      console.log("alright");
      res.send("available");
    } else {
      console.log("nooooo");
      res.send("not available");
    }
  });

  console.log("Inside check availibility Post Request");
  console.log("Req Body : ", req.body);
});

app.post("/createshop", function (req, res) {
  let shopname = req.body.shopname;
  let username = req.cookies.username;

  let sql = "insert into shop(shop_name, shop_owner) values(?,?)";
  con.query(sql, [shopname, username], function (err, result, fields) {
    if (err) {
      res.send("FAILURE");
    } else {
      res.send("SUCCESS");
    }
  });

  console.log("Inside Register Post Request");
  console.log("Req Body : ", req.body);
});

app.post("/upload", async (req, res, next) => {
  console.log("Inside Upload POST");
  const base64Image = req.body.image;
  let username = req.cookies.username;
  const imageName = "profile-pictures/" + username + ".js";
  let response;

  try {
    response = await imagesService.upload(imageName, base64Image);
  } catch (err) {
    console.error(`Error uploading image: ${err.message}`);
    return next(new Error(`Error uploading image: ${imageName}`));
  }

  res.send({ link: response });
});

app.get("/shopexists", function (req, res) {
  console.log("inside GET Shop home");
  let username = req.cookies.username;
  let sql = "select *from shop where shop_owner=?";
  con.query(sql, [username], function (err, result, fields) {
    if (err) {
      console.log("Insertion failed");
    } else {
      if (result.length == 0) {
        res.send("shopname not registered");
      } else {
        res.send(result[0].shop_name);
      }
    }
  });
});

app.post("/additem", async (req, res, next) => {
  console.log("Inside AddItem Post Request");
  let item_name = req.body.item_name;
  let shop_name = req.body.shop_name;
  let category = req.body.category;
  let description = req.body.description;
  let price = req.body.price;
  let quantity = req.body.quantity;

  let imageName = req.body.imageName;
  const base64Image = req.body.image;
  const key_image_name = `items/${imageName}`;
  let response;

  try {
    response = await imagesService.upload(key_image_name, base64Image);

    let sql =
      "insert into item (item_name, shop_name, category, description, price, quantity, key_image_name) values(?,?,?,?,?,?,?)";
    con.query(
      sql,
      [
        item_name,
        shop_name,
        category,
        description,
        price,
        quantity,
        key_image_name,
      ],
      function (err, result, fields) {
        if (err) {
          console.log("Insertion failed");
        } else {
          console.log("1 record inserted");
        }
      }
    );
  } catch (err) {
    console.error(`Error uploading image: ${err.message}`);
    return next(new Error(`Error uploading image: ${imageName}`));
  }
  res.end("complete");
});

app.post("/updateitem", async (req, res, next) => {
  console.log("Inside UpdateItem Post Request");
  console.log("Req Body : ", req.body);
  let item_name = req.body.item_name;
  let category = req.body.category;
  let description = req.body.description;
  let price = req.body.price;
  let quantity = req.body.quantity;

  let imageName = req.body.imageName;
  const base64Image = req.body.image;
  const key_image_name = `items/${imageName}`;
  let response;

  if (base64Image === null) {
    let sql =
      "update item set item_name=?,category=?,description=?,price=?,quantity=? where item_name=?";
    con.query(
      sql,
      [item_name, category, description, price, quantity, item_name],
      function (err, result, fields) {
        if (err) {
          console.log("Updation failed");
        } else {
          console.log("1 record updated");
        }
      }
    );
  } else {
    try {
      response = await imagesService.upload(key_image_name, base64Image);

      let sql =
        "update item set item_name=?,category=?,description=?,price=?,quantity=?,key_image_name=? where item_name=?";
      con.query(
        sql,
        [
          item_name,
          category,
          description,
          price,
          quantity,
          key_image_name,
          item_name,
        ],
        function (err, result, fields) {
          if (err) {
            console.log("Updation failed");
          } else {
            console.log("1 record updated");
          }
        }
      );
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
      return next(new Error(`Error uploading image: ${imageName}`));
    }
  }
});

app.get("/getitems", function (req, res, next) {
  console.log("Inside shop GET items Request");

  let shop_name = req.query.shopName;
  let sql = "select item_name,sales from item where shop_name=?";
  con.query(sql, shop_name, function (err, result, fields) {
    if (err) {
      console.log("Data fetching failed");
      res.send({ status: "failed" });
    } else {
      res.send(result);
    }
  });
});

app.get("/getallitems", function (req, res, next) {
  console.log("Inside GET all items dashboard Request");
  let username = req.cookies.username;
  let sql =
    "select item_name, price, item.key_image_name from item, user, shop where user.username!=? and user.username=shop.shop_owner and item.shop_name=shop.shop_name";

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

  con.query(sql, username, function (err, result, fields) {
    if (err) {
      console.log("Data fetching failed", err.code);
      res.send({ status: "failed" });
    } else {
      let images_arr = [];
      let promises = [];
      for (let i = 0; i < result.length; i++) {
        promises.push(fetchImage(i, images_arr, result[i].key_image_name));
      }

      Promise.all(promises)
        .then(() => {
          console.log("All images fetched successfully!");
          for (let i = 0; i < result.length; i++) {
            result[i].image = images_arr[i];
          }
          res.send(result);
        })
        .catch((e) => {
          // Handle errors here
        });
    }
  });
});

app.post("/addtofavourites", function (req, res) {
  console.log("Inside Add to Favourites Post Request");
  let item_name = req.body.item_name;
  let username = req.cookies.username;

  let sql = "select *from favourites where item_name=? and username=?";

  con.query(sql, [item_name, username], function (err, result, fields) {
    if (err) {
      console.log("FAILURE in fetching details");
    } else {
      if (result.length === 0) {
        //no favourite record found, so add it
        sql = "insert into favourites(item_name,username) values(?,?)";
        con.query(sql, [item_name, username], function (err, result, fields) {
          if (err) {
            console.log("FAILURE in inserting to favourites");
          } else {
            res.send("SUCCESS");
          }
        });
      } else {
        //favourite was already present. So toggle it and unfavourite
        sql = "delete from favourites where item_name=? and username=?";
        con.query(sql, [item_name, username], function (err, result, fields) {
          if (err) {
            console.log("FAILURE to remove fro favourites");
          } else {
            res.send("SUCCESS");
          }
        });
      }
    }
  });
});

app.get("/checkfavourite", function (req, res, next) {
  console.log("Inside Check If Favourite Item GET Request");

  let item_name = req.query.item_name;
  let username = req.cookies.username;

  let sql = "select *from favourites where item_name=? and username=?";
  con.query(sql, [item_name, username], function (err, result, fields) {
    if (err) {
      console.log("Data fetching failed");
      res.send({ status: "failed" });
    } else {
      if (result.length === 1) {
        res.send("IS FAVOURITE");
      } else {
        res.send("NOT FAVOURITE");
      }
    }
  });
});

app.get("/getfavouriteitems", function (req, res, next) {
  console.log("Inside get Favourite Items GET Request");

  let username = req.cookies.username;
  let sql =
    "select favourites.item_name, item.price, item.key_image_name from item, favourites where favourites.username=? and favourites.item_name=item.item_name";

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

  con.query(sql, username, function (err, result, fields) {
    if (err) {
      console.log("Data fetching failed", err.code);
      res.send({ status: "failed" });
    } else {
      let images_arr = [];
      let promises = [];
      for (let i = 0; i < result.length; i++) {
        promises.push(fetchImage(i, images_arr, result[i].key_image_name));
      }

      Promise.all(promises)
        .then(() => {
          console.log("All images fetched successfully!");
          for (let i = 0; i < result.length; i++) {
            result[i].image = images_arr[i];
          }
          res.send(result);
        })
        .catch((e) => {
          // Handle errors here
        });
    }
  });
});

app.get("/itemdetails", function (req, res, next) {
  console.log("Items overview GET Request");
  let item_name = req.query.item_name;

  let sql = "select *from item where item_name=?";
  con.query(sql, item_name, function (err, result, fields) {
    if (err) {
      console.log(err);
    } else {
      let fetched_image_name = result[0].key_image_name;
      if (fetched_image_name !== null) {
        imagesService
          .getImage(fetched_image_name)
          .then((imageData) => {
            let buf = Buffer.from(imageData.Body);
            let base64Image = buf.toString("base64");
            result[0].image = base64Image;
            console.log("Data fetched successful");
            res.send(result);
          })
          .catch((e) => {
            res.send(result);
          });
      } else {
        res.send(result);
      }
    }
  });
});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
