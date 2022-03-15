import React from "react";
import { useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "../App.css";

function Newshop() {
  const [shopName, setShopName] = useState(null);
  const [available, setAvailable] = useState(null);
  let redirectVar = null;
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  const checkAvailibility = (e) => {
    e.preventDefault();
    console.log(shopName);
    axios
      .post("http://localhost:3001/checkavailibility", { shopName: shopName })
      .then((response) => {
        if (response.data === "available") {
          setAvailable(<p>available</p>);
        } else {
          setAvailable(<p>Shop name already taken!</p>);
        }
      });
  };

  const submitShopName = (e) => {
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    //set the with credentials to true
    console.log("chrchkk before submit");
    console.log(shopName);
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios
      .post("http://localhost:3001/createshop", { shopname: shopName })
      .then((response) => {
        console.log("Data isss: ", response.data);
        console.log("Status Code : ", response.status);
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
    </div>
  );
}

export default Newshop;
