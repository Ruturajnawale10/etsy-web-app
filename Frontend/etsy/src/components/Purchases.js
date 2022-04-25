import React, { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import Purchaseitemcard from "./Purchaseitemcard";

function Purchases() {
  let redirectVar = null;
  const [items, setItems] = useState([]);

  const [visibility, setVisibility] = useState("hidden");
  let pageS = localStorage.getItem("pageSize");
  const [pageSize, setPageSize] = useState(pageS);
  let pageN = localStorage.getItem("pageNum");
  const [pageNum, setPageNum] = useState(pageN);
  const [noPrev, setNoPrev] = useState(null);
  const [noNext, setNoNext] = useState(null);

  if (!localStorage.getItem("token")) {
    redirectVar = <Redirect to="/login" />;
  }

  useEffect(() => {
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios
      .get(process.env.REACT_APP_LOCALHOST + "/orders/history", {
        params: {
          pageNum: pageNum,
          pageSize: pageSize,
        },
      })
      .then((response) => {
        if (response.data === "FAILURE") {
          console.log("Failed to order");
        } else {
          console.log(response.data);
          if (response.data.length == 0) {
            console.log("No firther elements");
            setVisibility("visible");
            setNoNext(<p style={{ color: "red", marginLeft:"10px" }}>No further elements</p>);

          } else {
            setVisibility("visible");
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
        }
      });
  }, []);

  const changePageSize = (e) => {
    let size = e.target.options[e.target.selectedIndex].text;
    localStorage.setItem("pageSize", parseInt(size));
    localStorage.setItem("pageNum", 1);
    window.location.reload(false);
  };

  const nextPage = () => {
    localStorage.setItem("pageNum", parseInt(pageNum) + 1);
    window.location.reload(false);
  };

  const prevPage = () => {
    if (pageNum == 1) {
      setNoPrev(<p style={{ color: "red" }}>This is the first page</p>);
    } else {
      localStorage.setItem("pageNum", parseInt(pageNum) - 1);
      window.location.reload(false);
    }
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
        style={{
          justifyContent: "center",
          display: "flex",
          marginTop: "20px",
          visibility: visibility,
        }}
      >
        <nav aria-label="...">
          <ul class="pagination">
            {noPrev}
            <li class="page-item">
              <a class="page-link" onClick={prevPage}>
                Previous
              </a>
            </li>

            <li class="page-item">
              <a class="page-link" onClick={nextPage}>
                Next
              </a>
            </li>
            {noNext}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Purchases;
