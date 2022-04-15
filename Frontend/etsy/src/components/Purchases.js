import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import Purchaseitemcard from "./Purchaseitemcard";

function Purchases() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  if (!localStorage.getItem("token")) {
    redirectVar = <Redirect to="/login" />;
  }

  const [totalPurchases, setTotalPurchases] = useState(null);

  useEffect(() => {
    axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
    axios.get(process.env.REACT_APP_LOCALHOST + "/orders/history").then((response) => {
      if(response.data === "FAILURE") {
          console.log("Failed to order");
      } else {
        let total = 0;
        for (let i = 0; i < response.data.length; i++) {
          total += parseInt(response.data[i].price* response.data[i].quantity);
        }
        setTotalPurchases(total);
      setItems(
        <div className="container">
          <div className="row">
            {response.data.map((item) => (
              <div key={item.itemName} id="cardItem" className="col-xs-4">
                <Purchaseitemcard item={item} />
              </div>
            ))}
          </div>
        </div>
      );
    }
    });
  }, []);

  return (
    <div>
      {redirectVar}
      <h1>Past Purchases</h1>
      {items}
      <h1 style={{color: "blue"}}>Total amount of all items purchased is: $ {totalPurchases}</h1>
    </div>
  );
}

export default Purchases;
