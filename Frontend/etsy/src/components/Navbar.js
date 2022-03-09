import React, { Component } from "react";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import "../App.css";

function Navbar() {
  let redirectVar = null;
  let loginLink = null;
  let registerLink = null;
  let favouritesLink = null;
  let cartsLink = null;
  if (!cookie.load("cookie")) {
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
        <a href="/" class="navbar-brand">
                <img
                    src="https://cdn-icons-png.flaticon.com/128/130/130195.png"
                    width={40}
                    height={40}
                    class="img-fluid"
                ></img>
        </a>
    )

    cartsLink = (
        <a href="/" class="navbar-brand">
                <img
                    src="https://img.icons8.com/external-icongeek26-outline-icongeek26/344/external-cart-essentials-icongeek26-outline-icongeek26.png"
                    width={40}
                    height={40}
                    class="img-fluid"
                ></img>
        </a>
    )

  }

  return (
    <div>
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
      <link rel="stylesheet" href="style.css"></link>
      <body>
        <nav class="navbar navbar-expand-lg bg-light navbar-light">
          <div class="container">
            <a href="/" class="navbar-brand">
              <img
                src="https://cdn-icons-png.flaticon.com/512/825/825513.png"
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
              <form action="#">
                <input
                  id="searchbarid"
                  type="text"
                  placeholder="Search for anything"
                  name="search"
                  size={90}
                ></input>
                <button type="submit">
                  <i class="fa fa-search"></i>
                </button>
              </form>
            </div>

            <div class="collapse navbar-collapse" id="navmenu">
              <ul class="navbar-nav ms-auto navbar-nav-scroll">
                {/* <li class="nav-item">
                  <a href="/" class="nav-link">
                    Home
                  </a>
                </li> */}
                {loginLink}
                {registerLink}
                {favouritesLink}
                {cartsLink}

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarScrollingDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img
                    src="https://cdn-icons.flaticon.com/png/512/3033/premium/3033143.png?token=exp=1646801541~hmac=9c2870596695c4493f09a346b24638c0"
                    width={40}
                    height={40}
                    class="img-fluid"
                ></img>
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarScrollingDropdown">
                        <li><a class="dropdown-item" href="#">User Profile</a></li>
                        <li><a class="dropdown-item" href="#">Sell on Etsy</a></li>
                        <li><hr class="dropdown-divider"></hr></li>
                        <li><a class="dropdown-item" href="#">Logout</a></li>
                    </ul>
                </li>

                <a href="/" class="navbar-brand">
                
                </a>
                
                {/* <li class="nav-item">
                  <a href="/login" class="nav-link">
                    Login
                  </a>
                </li>
                <li class="nav-item">
                  <a href="/register" class="nav-link">
                    Register
                  </a>
                </li> */}
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
