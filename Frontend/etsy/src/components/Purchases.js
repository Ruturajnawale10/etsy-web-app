import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Purchaseitemcard from "./Purchaseitemcard";

function Purchases() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  const [totalPurchases, setTotalPurchases] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get(process.env.REACT_APP_LOCALHOST + "/purchasehistory").then((response) => {
      console.log(response.data);
      if(response.data === "FAILURE") {
          console.log("Failed to order");
      } else {
        console.log(response.data);
        let total = 0;
        for (let i = 0; i < response.data.length; i++) {
          total += parseInt(response.data[i].price);
        }
        setTotalPurchases(total);
      setItems(
        <div className="container">
          <div className="row">
            {response.data.map((item) => (
              <div key={item.item_name} id="cardItem" className="col-xs-4">
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
      <h1 style={{color: "blue"}}>Total amount of all items purchased is: {totalPurchases}</h1>
    </div>
  );
}

export default Purchases;
