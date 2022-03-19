import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Cartitemcard from "./Cartitemcard";

function Favourites() {
  const [redirectVar, setRedirectVar] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemsData, setItemsData] = useState(null);
  const [msg, setMsg] = useState(null);

  if (!cookie.load("cookie")) {
    setRedirectVar(<Redirect to="/login" />);
  }

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get("http://localhost:3001/getcartitems").then((response) => {
      let total = 0;
      for (let item of response.data) {
        total += item.price * item.quantity;
      }
      setTotal(total);
      setItemsData(response.data);
      setItems(
        <div className="container">
          <div className="row">
            {response.data.map((item) => (
              <div key={item.item_name} id="cartitemcard" className="col-xs-4">
                <Cartitemcard item={item} />
              </div>
            ))}
          </div>
        </div>
      );
    });
  }, []);

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const checkout = (e) => {
    let orderID = makeid(10);
    let data = {
      items: itemsData,
      order_id: orderID,
    };

    axios.defaults.withCredentials = true;

    axios.post("http://localhost:3001/checkout", data).then((response) => {
      if (response.data === "FILL ADDRESS") {
        setMsg(
          <p style={{ color: "red", fontSize: "20px", marginLeft:"50px" }}>
            Please fill your address in the profile for completing the order
          </p>
        );
      } else {
        console.log("Order placed successfully!");
        setRedirectVar(<Redirect to="/purchases" />);
      }
    });
  };

  return (
    <div>
      {redirectVar}
      <h1>Your Cart</h1>
      {items}

      <h3 style={{ marginTop: "60px", marginLeft: "50px" }}>Total: {total}</h3>

      <button
        type="button"
        class="btn btn-dark rounded-pill"
        style={{
          width: "400px",
          height: "50px",
          fontSize: "22px",
          marginTop: "30px",
          marginLeft: "50px",
        }}
        onClick={checkout}
      >
        Proceed to Checkout
      </button>
      {msg}
    </div>
  );
}

export default Favourites;
