import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Itemcard from "./Itemcard";

function Favourites() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get(process.env.REACT_APP_LOCALHOST + "/getfavouriteitems").then((response) => {
      setItems(
        <div className="container">
          <div className="row">
            {response.data.map((item) => (
              <div key={item.item_name} id="cardItem" className="col-xs-4">
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
