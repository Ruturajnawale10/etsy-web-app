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

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get("http://localhost:3001/purchasehistory").then((response) => {
      console.log(response.data);
      if(response.data === "FAILURE") {
          console.log("Failed to order");
      } else {
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
    </div>
  );
}

export default Purchases;
