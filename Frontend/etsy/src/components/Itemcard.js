import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import favouritesicon from "../images/favouritesicon.jpg";
import nonfavouritesicon from "../images/nonfavouritesicon.jpg";

function Itemcard(props) {
  const [favouritesIconSRC, setFavouritesIconSRC] = useState("");

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:3001/checkfavourite", {
        params: {
          item_name: props.item.item_name,
        },
      })
      .then((response) => {
        if (response.data === "IS FAVOURITE") {
          setFavouritesIconSRC(favouritesicon);
        } else {
          setFavouritesIconSRC(nonfavouritesicon);
        }
      });
  }, []);

  const addToFavourites = (e) => {
    e.preventDefault();
    if (favouritesIconSRC === favouritesicon) {
      setFavouritesIconSRC(nonfavouritesicon);
    } else {
      setFavouritesIconSRC(favouritesicon);
    }

    const data = {
      item_name: props.item.item_name,
    };

    axios.defaults.withCredentials = true;

    axios
      .post("http://localhost:3001/addtofavourites", data)
      .then((response) => {
        console.log("Added to favourites");
      });
  };

  return (
    <div>
      <div class="row">
        <div className="card" style={{ width: "100%" }}>
          <div class="col-md-4">
            <div class="thumbnail">
              <a href="/cart" class="navbar-brand">
                <img
                  src={favouritesIconSRC}
                  alt="fav"
                  width={40}
                  height={40}
                  class="img-fluid"
                  onClick={addToFavourites}
                ></img>
              </a>

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

                <div>
                  <div style={{ display: "inline-block" }}>
                    {props.item.item_name}
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "200px" }}>
                    Price: {props.item.price}$
                  </div>
                  <div>
                    <p></p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itemcard;
