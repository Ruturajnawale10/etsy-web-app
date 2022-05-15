import React, { useEffect, useState } from "react";
import axios from "axios";
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
        "query _($itemInput: ItemInput) {getItemDetails(item: $itemInput) {itemName, price, imageName, shopName, sales, description}}",
        {
          itemInput: {
            itemName: itemName,
          },
        }
      );
      setItem(response.getItemDetails);
    })();
  }, []);

  const addToCart = (e) => {
    e.preventDefault();
    if (parseInt(quantityRequested) > item.quantity) {
      setAlert(<h6 style={{ color: "red" }}>Out of stock</h6>);
    } else {
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
          "mutation _($itemOrderInput: ItemOrderInput) {addToCart(item: $itemOrderInput)}",
          {
            itemOrderInput: {
              user_id: localStorage.getItem("user_id"),
              itemName: item.itemName,
              quantityRequested: quantityRequested,
            },
          }
        );
        setAlert(<h6 style={{ color: "green" }}>Added to cart</h6>);
      })();
    }
  };

  return (
    <div>
      <div className="card" style={{ width: "100%" }}>
        <div class="row">
          <div class="col-md-5" style={{ marginLeft: "50px" }}>
            <div class="thumbnail">
              <a
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "25px",
                }}
              >
                <img
                  src={item.imageName}
                  alt="Unavailable"
                  style={{ width: "100%" }}
                ></img>
              </a>
            </div>
          </div>
          <div
            class="col-md-4"
            style={{ marginLeft: "150px", marginTop: "100px" }}
          >
            <a href={`/items/shopdetails/${item.shopName}`}>
              {" "}
              Shop: {item.shopName}
            </a>
            <h6> Sales: {item.sales}</h6>
            <br></br>
            <h2>
              {item.itemName} | {item.description}
            </h2>
            <h2>$ {item.price}</h2>
            <br></br>
            <input
              type="text"
              class="form-control"
              name="username"
              placeholder="Enter quantity"
              style={{ width: "200px" }}
              value={quantityRequested}
              onChange={(e) => {
                setQuantityRequested(e.target.value);
                setAlert(null);
              }}
            />
            <br />
            {alert}
            <br />
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
