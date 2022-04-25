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
      <li class="nav-item">
        <a href="/login" class="nav-link">
          Login
        </a>
      </li>
    );

    registerLink = (
      <li class="nav-item">
        <a href="/register" class="nav-link">
          Register
        </a>
      </li>
    );
  } else {
    favouritesLink = (
      <a href="/items/favourites" class="navbar-brand">
        <img
          src={favouritesicon}
          width={40}
          height={40}
          class="img-fluid"
        ></img>
      </a>
    );

    cartsLink = (
      <a href="/cart" class="navbar-brand">
        <img src={cartsicon} width={40} height={40} class="img-fluid"></img>
      </a>
    );

    purchasesLink = (
      <a
        href="/purchases"
        class="navbar-brand"
        onClick={() => {
          localStorage.setItem("pageNum", 1);
        }}
      >
        <img src={cart} width={40} height={40} class="img-fluid"></img>
      </a>
    );

    sellOnEtsyLink = (
      <a href="/your/shop" class="navbar-brand">
        Sell on Etsy
      </a>
    );

    logoutLink = (
      <a href="/logout" class="navbar-brand">
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
      </head>

      <body>
        <nav class="navbar navbar-expand-lg bg-light navbar-light">
          <div class="container-fluid">
            <a href="/" class="navbar-brand">
              <img
                src={etsyicon}
                width={40}
                height={40}
                class="img-fluid"
              ></img>
            </a>

            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navmenu"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="search-container">
              <form action={searchContent}>
                <input
                  id="searchbarid"
                  type="text"
                  placeholder="Search for items"
                  size={90}
                  onChange={(e) => {
                    setSearchContent("items/search/" + e.target.value);
                  }}
                ></input>
                <button type="submit">
                  <i class="fa fa-search"></i>
                </button>
              </form>
            </div>
            <div class="collapse navbar-collapse" id="navmenu">
              <ul class="navbar-nav ms-auto navbar-nav-scroll">
                {loginLink}
                {registerLink}
                {favouritesLink}
                {cartsLink}
                {purchasesLink}
                {sellOnEtsyLink}
                {logoutLink}

                <a href="/your/profile" class="navbar-brand">
                  <img
                    src={profileicon}
                    width={40}
                    height={40}
                    class="img-fluid"
                  ></img>
                </a>
                <a href="/" class="navbar-brand"></a>
              </ul>
            </div>
          </div>
        </nav>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
          crossorigin="anonymous"
        ></script>
      </body>
    </div>
  );
}

export default Navbar;
