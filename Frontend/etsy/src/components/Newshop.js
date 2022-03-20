import React from "react";
import { useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "../App.css";

function Newshop() {
  const [shopName, setShopName] = useState(null);
  const [available, setAvailable] = useState(null);
  let [redirectVar, setRedirectVar] = useState(null);
  const [msg, setMsg] = useState(null);

  if (!cookie.load("cookie")) {
    setRedirectVar(<Redirect to="/login" />);
  }

  const checkAvailibility = (e) => {
    e.preventDefault();
    axios.get(process.env.REACT_APP_LOCALHOST + "/checkavailibility", {
        params: {
          shopName: shopName,
        },
      })
      .then((response) => {
        if (response.data === "available") {
          setAvailable(<p style={{marginLeft:"600px", marginTop:"60px", color:"green", fontSize:"20px"}}>Available</p>);
        } else {
          setAvailable(<p style={{marginLeft:"600px", marginTop:"60px", color:"red", fontSize:"20px"}}>Shop name already taken!</p>);
        }
      });
  };

  const submitShopName = (e) => {
    //prevent page from refresh
    e.preventDefault();
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios
      .post(process.env.REACT_APP_LOCALHOST + "/createshop", { shopname: shopName })
      .then((response) => {
        if (response.data === "FILL ADDRESS") {
          setMsg(
            <p style={{ color: "red", fontSize: "20px", marginLeft:"50px" }}>
              Please fill your address in the profile for creating a new shop
            </p>
          );
        }
        else if (response.data === "SUCCESS") {
          setRedirectVar(<Redirect to="/sellonetsy"/>);
        }
      });
  };

  return (
    <div>
      {redirectVar}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      ></link>

      <h1>Name your shop</h1>
      <p style={{ textAlign: "center", fontSize: "20px" }}>
        Choose a memorable name that reflects your style
      </p>
      <span>
        <input
          type="text"
          className="textbox"
          placeholder="Enter shop name"
          onChange={(e) => {
            setShopName(e.target.value);
          }}
        ></input>
        <button className="btn btn-secondary" onClick={checkAvailibility}>
          Check Availability
        </button>
      </span>
      <br />
      {available}
      <button
        style={{ marginTop: 60, marginLeft: 850 }}
        className="btn btn-primary"
        onClick={submitShopName}
      >
        Create Shop
      </button>
      {msg}
    </div>
  );
}

export default Newshop;
