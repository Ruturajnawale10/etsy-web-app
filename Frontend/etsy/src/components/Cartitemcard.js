import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useDispatch } from "react-redux";
import { setCannotCheckOut } from "../reducers/checkoutSlice";

function Cartitemcard(props) {
  const [outOfStock, setOutOfStock] = useState("");
  const [options, setOptions] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    let arr = [];
    for (let i = 0; i < props.item.quantity; i++) {
      arr.push(i + 1);
    }
    setOptions(arr.map((val) => <option>{val}</option>));
    if (
      parseInt(props.item.quantityRequested) > props.item.quantity
    ) {
      setOutOfStock(
        <h6 style={{ color: "red" }}>
          Sorry, these items got sold. Please request for different quantity if
          available.{" "}
        </h6>
      );
      dispatch(setCannotCheckOut());
    }
  }, [dispatch, props.item.quantity, props.item.quantityRequested]);

  const removeItem = (e) => {
    e.preventDefault();
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");

    axios
      .post(process.env.REACT_APP_LOCALHOST + "/items/removefromcart", {
        itemName: props.item.itemName,
      })
      .then((response) => {
        if (response.status === 200) {
          window.location.reload(false);
        }
      });
  };

  const changeQuantity = (e) => {
    e.preventDefault();
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");

    axios.post(process.env.REACT_APP_LOCALHOST + "/items/change/quantity", {
      itemName: props.item.itemName,
      newQuantity: e.target.options[e.target.selectedIndex].text,
    }).then(() => {
      window.location.reload(false);
    });
  };

  return (
    <div>
      <div class="row">
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
                <label
                  class="container"
                  style={{ marginLeft: "100px", marginTop: "20px" }}
                >
                  <input type="checkbox" /> This order is a gift
                  <span class="checkmark"></span>
                </label>
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
