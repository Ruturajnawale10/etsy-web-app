import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Redirect } from "react-router";
import Cartitemcard from "./Cartitemcard";

function Favourites() {
  var [redirectVar, setRedirectVar] = useState(null);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemsData, setItemsData] = useState(null);
  const [msg, setMsg] = useState(null);

  const canCheckout = useSelector((state) => state.checkoutSlice.canCheckout);

  if (!localStorage.getItem("token")) {
    setRedirectVar = <Redirect to="/login" />;
  }

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
        "query _($userInput: UserInput) {getCartItems(user: $userInput) {itemName, price, quantityRequested}}",
        {
          userInput: {
            id: localStorage.getItem("user_id"),
          },
        }
      );
      setTotal(total);
      setItemsData(response.getCartItems);
      setItems(
        <div className="container">
          <div className="row">
            {response.getCartItems.map((item) => (
              <div key={item.itemName} id="cartitemcard" className="col-xs-4">
                <Cartitemcard item={item} />
              </div>
            ))}
          </div>
        </div>
      );
    })();
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
    if (canCheckout === "NO") {
      setMsg(
        <p style={{ color: "red", fontSize: "20px", marginLeft: "50px" }}>
          Cannot checkout. Please remove the items with Insufficient requested
          quantities or request for different quantity if available.
        </p>
      );
      return;
    }
    let orderID = makeid(10);
    let data = {
      items: itemsData,
      orderID: orderID,
    };

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
        "mutation _($checkoutData: CheckoutInput) {checkoutItems(checkoutData: $checkoutData)}",
        {
          checkoutData: {
            orderID: orderID,
            userID: localStorage.getItem("user_id"),
            userName: localStorage.getItem("username"),
          },
        }
      );
      if (response.checkoutItems === "FILL ADDRESS") {
        setMsg(
          <p style={{ color: "red", fontSize: "20px", marginLeft: "50px" }}>
            Please fill your address in the profile for completing the order
          </p>
        );
      } else {
        console.log("Order placed successfully!");
        setRedirectVar(<Redirect to="/purchases" />);
      }
    })();
  };

  return (
    <div>
      {redirectVar}
      <h1>Your Cart</h1>
      {items}

      <h3 style={{ marginTop: "60px", marginLeft: "50px" }}>
        Total: $ {total}
      </h3>

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
