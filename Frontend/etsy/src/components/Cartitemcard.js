import React, { useEffect, useState } from "react";
import axios from "axios";

function Cartitemcard(props) {
  const [outOfStock, setOutOfStock] = useState("");
  const [msg, setMsg] = useState();

  useEffect(() => {
    if (parseInt(props.item.quantityRequested) > parseInt(props.item.quantity)) {
      setOutOfStock(<h6 style={{ color: "red" }}>Insufficient stock</h6>);
    }
  }, []);

  const removeItem = (e) => {
    e.preventDefault();
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");

    axios
      .post(process.env.REACT_APP_LOCALHOST + "/items/removefromcart", {
        itemName: props.item.itemName,
      })
      .then((response) => {
        if (response.status == 200) {
          setMsg(
            <p style={{ color: "blue", fontSize: "20px", marginLeft: "50px" }}>
              Item removed from cart
            </p>
          );
        }
      });
  };

  return (
    <div>
      <div class="row">
        {msg}
        <div className="card" style={{ width: "100%" }}>
          <div class="col-md-8">
            <div class="thumbnail">
              <div>
                <div style={{ display: "inline-block" }}>
                  Name: {props.item.itemName}
                </div>
                <div style={{ display: "inline-block", marginLeft: "150px" }}>
                  Price: $ {props.item.price}
                </div>
                <div style={{ display: "inline-block", marginLeft: "150px" }}>
                  Quantity: {props.item.quantityRequested}
                </div>
                <div style={{ display: "inline-block", marginLeft: "150px" }}>
                  {outOfStock}
                </div>
                <div style={{ marginLeft: "850px" }}>
                  <button
                    type="button"
                    class="btn btn-link"
                    onClick={removeItem}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cartitemcard;
