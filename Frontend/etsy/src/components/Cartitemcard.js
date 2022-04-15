import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Cartitemcard(props) {
  const [outOfStock, setOutOfStock] = useState("");
  const [msg, setMsg] = useState();
  const [options, setOptions] = useState("");
  let arr = [];
  for (let i = 0; i < props.item.quantity; i++) {
    arr.push(i + 1);
  }

  useEffect(() => {
    if (
      parseInt(props.item.quantityRequested) > parseInt(props.item.quantity)
    ) {
      setOutOfStock(<h6 style={{ color: "red" }}>Insufficient stock</h6>);
    } else {
      setOptions(arr.map((val) => <option>{val}</option>));
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

  const changeQuantity = (e) => {
    e.preventDefault();
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");

    axios
      .post(process.env.REACT_APP_LOCALHOST + "/items/change/quantity", {
        itemName: props.item.itemName,
        newQuantity: e.target.options[e.target.selectedIndex].text
      })
      .then((response) => {
        if (response.status == 200) {
          setMsg(
            <p style={{ color: "blue", fontSize: "20px", marginLeft: "50px" }}>
             {e.target.options[e.target.selectedIndex].text}
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
                  Quantity: &emsp;
                  <select id="quantity_options" onChange={changeQuantity}>
                    <option>{props.item.quantityRequested}</option>
                    {options}
                  </select>
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
