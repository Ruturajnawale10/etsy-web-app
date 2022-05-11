import React, { useEffect, useState } from "react";
import axios from "axios";
import favouritesicon from "../images/favouritesicon.jpg";
import nonfavouritesicon from "../images/nonfavouritesicon.jpg";

function Itemcard(props) {
  const [favouritesIconSRC, setFavouritesIconSRC] = useState(nonfavouritesicon);
  const currency = localStorage.getItem("currency").split(" ")[0];

  // useEffect(() => {
  //   axios.defaults.headers.common["authorization"] =
  //   localStorage.getItem("token");
  //   axios
  //     .get(process.env.REACT_APP_LOCALHOST + "/items/checkfavourite", {
  //       params: {
  //         itemName: props.item.itemName,
  //       },
  //     })
  //     .then((response) => {
  //       if (response.data === "ITEM IS FAVOURITE") {
  //         setFavouritesIconSRC(favouritesicon);
  //       } else {
  //         setFavouritesIconSRC(nonfavouritesicon);
  //       }
  //     });
  // }, []);

  // const addToFavourites = (e) => {
  //   e.preventDefault();
  //   let isFavourite;
  //   if (favouritesIconSRC === favouritesicon) {
  //     isFavourite = "YES";
  //     setFavouritesIconSRC(nonfavouritesicon);
  //   } else {
  //     isFavourite = "NO";
  //     setFavouritesIconSRC(favouritesicon);
  //   }

  //   const data = {
  //     item: props.item,
  //     isFavourite: isFavourite
  //   };

  //   axios.defaults.headers.common["authorization"] =
  //   localStorage.getItem("token");

  //   axios
  //     .post(process.env.REACT_APP_LOCALHOST + "/items/addtofavourites", data)
  //     .then((response) => {
  //       console.log("Added to favourites");
  //     });
  // };

  return (
    <div>
      <div class="row">
        <div className="card" style={{ width: "100%" }}>
          <div class="col-md-4">
            <div class="thumbnail">
              <a href="/cart" class="navbar-brand">
                {/* <img
                  src={favouritesIconSRC}
                  alt="fav"
                  width={40}
                  height={40}
                  class="img-fluid"
                  onClick={addToFavourites}
                ></img> */}
              </a>

              <a
                href={`/items/${props.item.itemName}`}
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "25px",
                }}
              >
                <img
                  src={props.item.imageName}
                  alt="Unavailable"
                  style={{ width: "100%" }}   
                ></img>

                <div>
                  <div style={{ display: "inline-block" }}>
                    {props.item.itemName}
                  </div>
                  <div style={{ display: "inline-block", marginLeft: "200px" }}>
                    Price: {currency} {props.item.price}
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
