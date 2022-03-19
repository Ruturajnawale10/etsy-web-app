import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import favouritesicon from "../images/favouritesicon.jpg";
import nonfavouritesicon from "../images/nonfavouritesicon.jpg";

function Purchaseitemcard(props) {
  return (
    <div>
      <div className="card" style={{ width: "100%" }}>
        <div class="row">
          <div class="col-md-4">
            <div class="thumbnail">
              <a
                href={`/itemsoverview/${props.item.item_name}`}
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "25px",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${props.item.image}`}
                  alt="Unavailable"
                  style={{ width: "100%" }}
                ></img>
              </a>
            </div>
          </div>
          <div class="col-md-8">
            <div class="row" style={{ marginTop: "50px" }}>
              <div class="col" style={{fontSize:"20px"}}>Name: {props.item.item_name}</div>
              <div class="col" style={{fontSize:"20px"}}>Price: {props.item.price}$</div>
              <div class="col" style={{fontSize:"20px"}}>Quantity: {props.item.quantity}</div>
            </div>
            <div class="row" style={{ marginTop: "50px" }}>
              <div class="col-4" style={{fontSize:"20px"}}>Shop: {props.item.shop_name}</div>
              <div class="col" style={{fontSize:"20px"}}>Date of Purchase: {props.item.date}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Purchaseitemcard;
