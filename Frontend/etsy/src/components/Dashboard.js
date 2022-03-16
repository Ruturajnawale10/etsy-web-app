import React, { useEffect, useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Itemcard from "./Itemcard";

function Dashboard() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get("http://localhost:3001/getallitems").then((response) => {
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
      //   setFetchedImage(
      //     <img
      //       src={"data:image/jpeg;base64," + response.data[0].image}
      //       alt="Red dot"
      //       width={130}
      //       height={130}
      //       class="img-fluid"
      //     ></img>
      //   );
    });
  }, []);

  return (
    <div>
      {redirectVar}
      <h1>Welcome to Dashboard</h1>
      {items}
    </div>
  );
}

export default Dashboard;
