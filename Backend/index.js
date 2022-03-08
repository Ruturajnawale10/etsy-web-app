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
    secret              : 'cmpe273_kafka_passport_mongo',
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

  var Users = [{
      username : "admin",
      password : "admin"
  }]

  var books = [
    {"BookID" : "1", "Title" : "Book 1", "Author" : "Author 1"},
    {"BookID" : "2", "Title" : "Book 2", "Author" : "Author 2"},
    {"BookID" : "3", "Title" : "Book 3", "Author" : "Author 3"}
]

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
    // var username = req.body.username;
    // var password = req.body.password;
    console.log("Inside Login Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    Users.filter(function(user){
        if(user.username === req.body.username && user.password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        }
        else {
            res.end("Login Failed");
        }
    })
});

app.post('/register',function(req,res){
    
    // Object.keys(req.body).forEach(function(key){
    //     req.body = JSON.parse(key);
    // });
    // var username = req.body.username;
    // var password = req.body.password;
    console.log("Inside Register Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    Users.filter(function(user){
        res.end("Successful Registration"); 
    })
});

// //Route to get All Books when user visits the Home Page
// app.get('/home', function(req,res){
//     console.log("Inside Home Login");    
//     res.writeHead(200,{
//         'Content-Type' : 'application/json'
//     });
//     console.log("Books : ",JSON.stringify(books));
//     res.end(JSON.stringify(books));
    
// })

// app.post('/create',function(req, res) {
//     console.log("Inside create");    
//     res.writeHead(200,{
//         'Content-Type' : 'application/json'
//     });
//     console.log("Books body", req.body);
//     if (books.some(book => book.BookID === req.body.BookID)) {
//         console.log('Cannot add the book. Entered BookID already exists!');
//         res.end("book_addition_failed");
//     }
//     else {
//         books.push({"BookID": req.body.BookID, "Title": req.body.Title, "Author": req.body.Author});
//         res.end("book_addition_successful");
//     }
// })

// app.post('/delete',function(req, res) {
//     console.log("Inside delete");    
//     res.writeHead(200,{
//         'Content-Type' : 'application/json'
//     });
//     console.log("Books body", req.body);
//     let previous_len = books.length;
//     books = books.filter(book => book.BookID !== req.body.BookID);
//     let curr_len = books.length;

//     if (curr_len < previous_len) {
//         res.end("deletion successful");
//     }
//     else {
//         res.end("deletion failed");
//     }    
// })

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");