import React from "react";
import { useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import "../App.css";

function Newshop() {
  const [shopName, setShopName] = useState(null);
  const [available, setAvailable] = useState(null);
  let [redirectVar, setRedirectVar] = useState(null);
  const [msg, setMsg] = useState(null);

  if (!localStorage.getItem("token")) {
    setRedirectVar(<Redirect to="/login" />);
  }

  const checkAvailibility = (e) => {
    e.preventDefault();
    const qlQuery = async (query, variables = {}) => {
      const resp = await fetch("http://localhost:4001", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      return (await resp.json()).data;
    };

    (async () => {
      let response = await qlQuery(
        "query _($shopInput: ShopInput) {checkShopnameAvailability(shop: $shopInput)}",
        {
          shopInput: {
            shopName: shopName,
          },
        }
      );

      if (response.checkShopnameAvailability === "available") {
        setAvailable(
          <p
            style={{
              marginLeft: "600px",
              marginTop: "60px",
              color: "green",
              fontSize: "20px",
            }}
          >
            Available
          </p>
        );
      } else {
        setAvailable(
          <p
            style={{
              marginLeft: "600px",
              marginTop: "60px",
              color: "red",
              fontSize: "20px",
            }}
          >
            Shop name already taken!
          </p>
        );
      }
    })();
  };

  const submitShopName = (e) => {
    e.preventDefault();
    const qlQuery = async (query, variables = {}) => {
      const resp = await fetch("http://localhost:4001", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });
      return (await resp.json()).data;
    };

    (async () => {
      let response = await qlQuery(
        "mutation _($shopInput: ShopInput) {createShop(shop: $shopInput)}",
        {
          shopInput: {
            shopName: shopName,
            userName: localStorage.getItem("username"),
          },
        }
      );
      window.location.reload(false);
    })();
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
