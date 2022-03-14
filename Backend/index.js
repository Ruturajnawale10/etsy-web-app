//import the require dependencies
import express from 'express';
var app = express();
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import e from 'express';
import mysql from 'mysql'
import imagesService from './imagesService.js';

app.set('view engine', 'ejs');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'etsy-application',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

app.use(express.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

//create Amazon RDS mysql connection
var con = mysql.createConnection({
    host: "etsy-db-instance.cry0kqyq0tgc.us-west-1.rds.amazonaws.com",
    user: "admin",
    password: "bunTet-xivhu5-cefhog",
    database: "Etsy_database"
  });
  
  //connection to mysql
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");    

    //let sql = "select *from user";
    con.query("select *from user", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
  });

//Route to handle Post Request Call
app.post('/login',function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    
    let sql = "select * from user where username = ? AND password = ?";
    con.query(sql, [username, password], function (err, result, fields) {
        console.log(result);
        if (result.length === 0) {
            console.log("Invalid credentials");
            res.end("Login Failed");
        } else {
            console.log("User verified!");
            res.cookie('cookie',"admin",{maxAge: 480000, httpOnly: false, path : '/'});            
            req.session.user = result;
            res.end("Successful Login");
        }
    });

    console.log("Inside Login Post Request");
});

app.post('/register',function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;  
    
    let sql = "insert into user (username, email, password) values(?, ?, ?)";
    con.query(sql, [username, email, password], function (err, result, fields) {
        if (err) {
             console.log("Username already exists!");
        } else {
            console.log("1 record inserted");
        }
    });

    console.log("Inside Register Post Request");
    console.log("Req Body : ",req.body);
});

app.post('/logout',function(req,res){
    console.log("Inside logout Post Request");
    res.status(200).clearCookie('cookie', {
        path: '/'
      });
      req.session.destroy(function (err) {
        res.redirect('/');
      });
});

app.get('/profile',async (req,res,next) => {
    console.log("Inside Profile GET Request");
    console.log("Req Body : ",req.body);
    console.log("Req user : ",req.session.user);

    let username = "admin";
    let sql = "select *from user where username=?";
    con.query(sql, username, function (err, result, fields) {
        if (err) {
             console.log("Data fetching failed");
        }
        else {
            console.log("Heree 1");
            let imageURL = "profile-pictures/" + username + ".jpg";
            console.log(imageURL);

            imagesService.getImage(imageURL)
            .then((imageData)=>{
                    console.log("here bro");
                 //console.log(imageData);
                 let buf = Buffer.from(imageData.Body);
                 let base64Image = buf.toString('base64');
                 result[0].image = base64Image;
                console.log("Data fetching successful");
                res.send(result);
            }).catch((e)=>{
              res.send(e)
            })
            
        }
    });
});

app.post('/profile', async (req,res,next) => {
    console.log("Inside Profile POST");
    let name = req.body.name;
    let about = req.body.about;
    let city = req.body.city;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;
    
    let username = "admin";

    const base64Image = req.body.image;
    const imageName = "profile-pictures/" + username + ".jpg";
    let response;

    if (base64Image === null) {
        let sql = "update user set name=?,about=?,city=?,email=?,phone=?,address=? where username=?";
        con.query(sql, [name,about,city,email,phone,address,username], function (err, result, fields) {
            if (err) {
                console.log("Updation failed");
                
            } else {
                console.log("1 record updated");
            }
        });
    } 
    else {
        try {
            response = await imagesService.upload(imageName, base64Image);

            let sql = "update user set name=?,about=?,city=?,email=?,phone=?,address=?,profile_pic_url=? where username=?";
            con.query(sql, [name,about,city,email,phone,address,response,username], function (err, result, fields) {
                if (err) {
                    console.log("Updation failed");
                    
                } else {
                    console.log("1 record updated");
                }
            });
        } catch (err) {
            console.error(`Error uploading image: ${err.message}`);
            return next(new Error(`Error uploading image: ${imageName}`));
        }
}   
    console.log("Inside Register Post Request");
    console.log("Req Body : ",req.body);
    res.end("complete");
});

app.post('/checkavailibility',function(req,res){
    let shopname = req.body.shopName;

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
        }
        else {
            console.log("nooooo");
            res.send("not available");
        }
    });

    console.log("Inside check availibility Post Request");
    console.log("Req Body : ",req.body);
});

app.post('/createshop',function(req,res){
    let shopname = req.body.shopname;
    let username = "admin";

    console.log("Shopp");
    console.log(shopname);
    let sql = "insert into shop(shop_name, shop_owner) values(?,?)";
    con.query(sql, [shopname, username], function (err, result, fields) {
        if (err) {
             console.log("Insertion failed");
             
        } else {
            console.log("1 record added");
        }
    });

    console.log("Inside Register Post Request");
    console.log("Req Body : ",req.body);
});

app.post('/upload', async (req, res, next) => {
    console.log("Inside Upload POST");
    const base64Image = req.body.image;
    let username = "admin";
    const imageName = "profile-pictures/" + username + ".js";
    let response;

    try {
        response = await imagesService.upload(imageName, base64Image);
    } catch (err) {
        console.error(`Error uploading image: ${err.message}`);
        return next(new Error(`Error uploading image: ${imageName}`));
    }

    res.send({link: response});
});

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");