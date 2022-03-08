//import the require dependencies
import express from 'express';
var app = express();
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import e from 'express';
import mysql from 'mysql'
app.set('view engine', 'ejs');

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
    
    // Object.keys(req.body).forEach(function(key){
    //     req.body = JSON.parse(key);
    // });
    let username = req.body.username;
    let password = req.body.password;
    
    let sql = "select * from user where username = ? AND password = ?";
    con.query(sql, [username, password], function (err, result, fields) {
        console.log(result);
        if (result.length === 0) {
            console.log("Invalid credentials");
        } else {
            console.log("User verified!");
        }
    });

    console.log("Inside Login Post Request");
});

app.post('/register',function(req,res){
    
    // Object.keys(req.body).forEach(function(key){
    //     req.body = JSON.parse(key);
    // });
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

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");