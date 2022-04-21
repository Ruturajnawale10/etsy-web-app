import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import Purchaseitemcard from "./Purchaseitemcard";
import Pagination from "./Pagination";


function Purchases() {
  let redirectVar = null;
  const [items, setItems] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageBar, setPageBar] = useState(null);

  if (!localStorage.getItem("token")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios
      .get(process.env.REACT_APP_LOCALHOST + "/orders/history")
      .then((response) => {
        if (response.data === "FAILURE") {
          console.log("Failed to order");
        } else {
          setPageBar(<Pagination />);

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

  const changePageSize = (e) => {
    setPageSize(e.target.options[e.target.selectedIndex].text);
  };

  return (
    <div>
      {redirectVar}
      <h1>Past Purchases</h1>
      <div style={{ marginLeft: "1000px" }}>
        Change Page Size &emsp;
        <select id="quantity_options" onChange={changePageSize}>
          <option>{pageSize}</option>
          <option>{2}</option>
          <option>{5}</option>
          <option>{10}</option>
        </select>
      </div>

      {items}
      <div
        style={{ justifyContent: "center", display: "flex", marginTop: "20px" }}
      >
        {pageBar}
      </div>
    </div>
  );
}

export default Purchases;
