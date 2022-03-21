import config_rds from "./configs/config_rds.js";
import mysql from "mysql";

var pool = mysql.createPool({...config_rds, connectionLimit:4});

pool.getConnection((err,connection)=> {
  if(err)
    throw err;
  console.log('Database connected successfully');
  connection.release();
});

export default pool;