import React, { useState } from "react";
import favouritesicon from "../images/favouritesicon.jpg";
import etsyicon from "../images/etsy-icon.png";
import cartsicon from "../images/carts-icon.png";
import profileicon from "../images/profile-icon.png";
import cart from "../images/cart.png";
import "../App.css";

function Navbar() {
  let [searchContent, setSearchContent] = useState(null);
  let loginLink = null;
  let registerLink = null;
  let favouritesLink = null;
  let cartsLink = null;
  let purchasesLink = null;
  let sellOnEtsyLink = null;
  let logoutLink = null;

  if (!localStorage.getItem("token")) {
    loginLink = (
      <a href="/login" style={{ marginLeft: "10px" }}>
        Login
      </a>
    );

    registerLink = (
      <a href="/register" style={{ marginLeft: "10px" }}>
        register
      </a>
    );
  } else {
    favouritesLink = (
      <a href="/items/favourites" style={{ marginLeft: "10px" }}>
        <img src={favouritesicon} width={35} height={35}></img>
      </a>
    );

    cartsLink = (
      <a href="/cart" style={{ marginLeft: "10px" }}>
        <img src={cartsicon} width={35} height={35}></img>
      </a>
    );

    purchasesLink = (
      <a
        href="/purchases"
        onClick={() => {
          localStorage.setItem("pageNum", 1);
        }}
        style={{ marginLeft: "10px" }}
      >
        <img src={cart} width={35} height={35} class="img-fluid"></img>
      </a>
    );

    sellOnEtsyLink = (
      <a href="/your/shop" style={{ marginLeft: "10px" }}>
        Sell
      </a>
    );

    logoutLink = (
      <a href="/logout" style={{ marginLeft: "10px" }}>
        Logout
      </a>
    );
  }

  return (
    <div>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
          crossorigin="anonymous"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
          crossorigin="anonymous"
        ></script>
      </head>

      <body>
        <div class="topnav">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <a href="/" style={{ marginLeft: "10px" }}>
              <img src={etsyicon} width={35} height={35}></img>
            </a>
            <div
              class="search-container"
              style={{ marginTop: "6px", marginRight: "10px" }}
            >
              <form action={searchContent}>
                <input
                  id="searchbarid"
                  type="text"
                  placeholder="Search for items"
                  onChange={(e) => {
                    setSearchContent("items/search/" + e.target.value);
                  }}
                ></input>
                <button type="submit">
                  <i class="fa fa-search"></i>
                </button>
              </form>
            </div>
          </div>
          {loginLink}
          {registerLink}
          {favouritesLink}
          {cartsLink}
          {purchasesLink}
          {sellOnEtsyLink}
          {logoutLink}
          <a href="/your/profile">
            <img
              src={profileicon}
              width={35}
              height={35}
              style={{ marginLeft: "10px" }}
            ></img>
          </a>
        </div>
      </body>
    </div>
  );
}

export default Navbar;
