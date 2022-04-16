import config from "../configs/config.js";
import mysql from "mysql";

var pool = mysql.createPool({...config.awsRDS, connectionLimit:4});

pool.getConnection((err,connection)=> {
  if(err)
    throw err;
  console.log('Database connected successfully');
  connection.release();
});

export default pool;