import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import Itemcard from "./Itemcard";

function Favourites() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  if (!localStorage.getItem("token")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
    axios.get(process.env.REACT_APP_LOCALHOST + "/items/favourites").then((response) => {
      setItems(
        <div className="container">
          <div className="row">
            {response.data.map((item) => (
              <div key={item.itemName} id="cardItem" className="col-xs-4">
                <Itemcard item={item} />
              </div>
            ))}
          </div>
        </div>
      );
    });
  }, []);

  return (
    <div>
      {redirectVar}
      <h1>Favourite Items</h1>
      {items}
    </div>
  );
}

export default Favourites;
