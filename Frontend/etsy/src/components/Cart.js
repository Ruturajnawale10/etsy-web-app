import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Cartitemcard from "./Cartitemcard";

function Favourites() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get("http://localhost:3001/getcartitems").then((response) => {
      let total = 0;
      for (let item of response.data) {
          total += item.price* item.quantity;
      }
      setTotal(total);
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

  const checkout = (e) => {

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
    </div>
  );
}

export default Favourites;
