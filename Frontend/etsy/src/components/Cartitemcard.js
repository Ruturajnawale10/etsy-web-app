import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import favouritesicon from "../images/favouritesicon.jpg";
import nonfavouritesicon from "../images/nonfavouritesicon.jpg";

function Cartitemcard(props) {
  const [favouritesIconSRC, setFavouritesIconSRC] = useState("");

  return (
    <div>
      <div class="row">
        <div className="card" style={{ width: "100%" }}>
          <div class="col-md-8">
            <div class="thumbnail">
                <div>
                  <div style={{ display: "inline-block" }}>
                    Name: {props.item.itemName}
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "200px" }}>
                    Price: {props.item.price}$
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "200px" }}>
                    Quantity: {props.item.quantity}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cartitemcard;
