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
        "query _($userInput: UserInput) {getAllItems(user: $userInput) {itemName, price, imageName}}",
        {
          userInput: {
            id: localStorage.getItem("user_id"),
          },
        }
      );
      setItems(
        <div className="container">
          <div className="row">
            {response.getAllItems.map((item) => (
              <div key={item.itemName} id="cardItem" className="col-xs-4">
                <Itemcard item={item} />
              </div>
            ))}
          </div>
        </div>
      );
      setFooter(<Footer />);
    })();
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
