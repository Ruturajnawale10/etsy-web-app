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
        maxAge: 480000,
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
      let imageURL = `profile-pictures/${username}.jpg`;
      console.log(imageURL);
        console.log(result);
      let fetchedURL = result[0].profile_pic_url;
      if (fetchedURL !== null) {
        imagesService
          .getImage(imageURL)
          .then((imageData) => {
            let buf = Buffer.from(imageData.Body);
            let base64Image = buf.toString("base64");
            result[0].image = base64Image;
            console.log("Data fetching successful");
            res.send(result);
          })
          .catch((e) => {
            res.send(result);
          });
      }
      else {
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
  const imageName = "profile-pictures/" + username + ".jpg";
  let response;

  if (base64Image === null) {
    let sql =
      "update user set name=?,about=?,city=?,email=?,phone=?,address=?,country=?,birthdate=?,gender=? where username=?";
    con.query(
      sql,
      [name, about, city, email, phone, address, country, birthdate, gender, username],
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
      response = await imagesService.upload(imageName, base64Image);

      let sql =
        "update user set name=?,about=?,city=?,email=?,phone=?,address=?,profile_pic_url=? where username=?";
      con.query(
        sql,
        [name, about, city, email, phone, address, response, username],
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
      console.log("Insertion failed");
    } else {
      console.log("1 record added");
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

  const base64Image = req.body.image;
  const imageName = `shop/${shop_name}/${item_name}.jpg`;
  let response;

  try {
    response = await imagesService.upload(imageName, base64Image);

    let sql =
      "insert into item (item_name, shop_name, category, description, price, quantity) values(?,?,?,?,?,?)";
    con.query(
      sql,
      [item_name, shop_name, category, description, price, quantity],
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
  console.log("Inside AddItem Post Request");
  console.log("Req Body : ", req.body);
  let item_name = req.body.item_name;
  let shop_name = req.body.shop_name;
  let category = req.body.category;
  let description = req.body.description;
  let price = req.body.price;
  let quantity = req.body.quantity;

  const base64Image = req.body.image;
  const imageName = `shop/${shop_name}/${item_name}.jpg`;
  let response;

  if (base64Image === null) {
    let sql =
      "update item set category=?,description=?,price=?,quantity=? where item_name=?";
    con.query(
      sql,
      [category, description, price, quantity, item_name],
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
      response = await imagesService.upload(imageName, base64Image);

      let sql =
        "update item set category=?,description=?,price=?,quantity=? where item_name=?";
      con.query(
        sql,
        [category, description, price, quantity, item_name],
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

    let sql = "select item_name, price from item, user, shop where user.username!=? and user.username=shop.shop_owner and item.shop_name=shop.shop_name";
    con.query(sql, username, function (err, result, fields) {
      if (err) {
        console.log("Data fetching failed");
        res.send({ status: "failed" });
      } else {
        res.send(result);
      }
    });
  });


//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
