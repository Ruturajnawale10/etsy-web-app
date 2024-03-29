import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import Itemcard from "./Itemcard";
import Footer from "../components/Footer.js";

function Dashboard() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  const [footer, setFooter] = useState(null);

  if (!localStorage.getItem("token")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
    axios.get(process.env.REACT_APP_LOCALHOST + "/items/getallitems").then((response) => {
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
      setFooter(<Footer/>);
    });
  }, []);

  return (
    <div>
      {redirectVar}
      <h1>Explore a variety of products</h1>
      {items}
      {footer}
    </div>
  );
}

export default Dashboard;
