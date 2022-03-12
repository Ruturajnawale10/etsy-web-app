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
  let sellOnEtsyLink = null;
  let logoutLink = null;

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
        <a href="/favourites" class="navbar-brand">
                <img
                    src="https://cdn-icons-png.flaticon.com/128/130/130195.png"
                    width={40}
                    height={40}
                    class="img-fluid"
                ></img>
        </a>
    )

    cartsLink = (
        <a href="/cart" class="navbar-brand">
                <img
                    src="https://img.icons8.com/external-icongeek26-outline-icongeek26/344/external-cart-essentials-icongeek26-outline-icongeek26.png"
                    width={40}
                    height={40}
                    class="img-fluid"
                ></img>
        </a>
    )

    sellOnEtsyLink = (
      <a href="/sellonetsy" class="navbar-brand">
              Sell on Etsy
      </a>
    )

    logoutLink = (
      <a href="/logout" class="navbar-brand">
              Logout
      </a>
    )
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
                {loginLink}
                {registerLink}
                {favouritesLink}
                {cartsLink}
                {sellOnEtsyLink}
                {logoutLink}

                <a href="/profile" class="navbar-brand">
              <img
                src="https://freesvg.org/img/abstract-user-flat-4.png"
                width={40}
                height={40}
                class="img-fluid"
              ></img>
            </a>
            <a href="/" class="navbar-brand">
                
                </a>
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
