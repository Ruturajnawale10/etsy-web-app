import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import favouritesicon from "../images/favouritesicon.jpg";
import nonfavouritesicon from "../images/nonfavouritesicon.jpg";

function Itemsoverview(props) {
  let url = document.location.href;
  let url_arr = url.split("/");
  let itemName = url_arr.pop();
  itemName = itemName.replaceAll("%20", " ").trim();
  const [item, setItem] = useState({ itemName: "Item Name", price: 0 });
  const [quantityRequested, setQuantityRequested] = useState(1);

  const [favouritesIconSRC, setFavouritesIconSRC] = useState(nonfavouritesicon);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
    console.log(itemName);
    console.log(url);

    axios
      .get(process.env.REACT_APP_LOCALHOST + "/items/checkfavourite", {
        params: {
          itemName: itemName,
        },
      })
      .then((response) => {
        if (response.data === "ITEM IS FAVOURITE") {
          setFavouritesIconSRC(favouritesicon);
        } else {
          setFavouritesIconSRC(nonfavouritesicon);
        }
      });

    axios
      .get(process.env.REACT_APP_LOCALHOST + "/items/details", {
        params: {
          itemName: itemName,
        },
      })
      .then((response) => {
        console.log(response.data);
        setItem(response.data);
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
      itemName: itemName,
    };

    axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");

    axios
      .post(process.env.REACT_APP_LOCALHOST + "/addtofavourites", data)
      .then((response) => {
        console.log("Added to favourites");
      });
  };

  const addToCart = (e) => {
      e.preventDefault();
      if (quantityRequested > item.quantity) {
            setAlert(<h6 style={{color:"red"}}>Out of Stock</h6>);
      } else {
        //call POST API to add to cart
        const data = {
            itemName: item.itemName,
            price: item.price,
            quantityRequested: quantityRequested
          };
      
          axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
          axios
            .post(process.env.REACT_APP_LOCALHOST + "/addtocart", data)
            .then((response) => {
              setAlert(<h6 style={{color:"green"}}>Added to cart</h6>);
            });
      }
  }

  return (
    <div>
      <div className="card" style={{ width: "100%" }}>
        <div class="row">
          <div class="col-md-5" style={{ marginLeft:"50px"}}>
            <div class="thumbnail">
              <a href="#" class="navbar-brand">
                <img
                  src={favouritesIconSRC}
                  style={{ marginLeft: "450px", marginTop:"20px" }}
                  alt="fav"
                  width={40}
                  height={40}
                  class="img-fluid"
                  onClick={addToFavourites}
                ></img>
              </a>

              <a
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "25px",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt="Unavailable"
                  style={{ width: "100%" }}
                ></img>
              </a>
            </div>
          </div>
          <div class="col-md-4" style={{ marginLeft:"150px", marginTop:"100px"}}>
            <a href={`/shopdetails/${item.shopName}`}> Shop: {item.shopName}</a>
            <h6> Sales: {item.sales}</h6>
            <br></br>
            <h2>
              {item.itemName} | {item.description}
            </h2>
            <h2>$ {item.price}</h2>
            <br></br>
            <input type="text"class="form-control" name="username" placeholder="Enter quantity" style={{width:"200px"}}
                value={quantityRequested} onChange = {(e) => {setQuantityRequested(e.target.value); setAlert(null)}}
            />
            <br/>
            {alert}
            <br/>
            <button
              type="button"
              class="btn btn-dark rounded-pill"
              style={{ width: "400px", height: "50px", fontSize: "22px" }}
              onClick={addToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itemsoverview;
