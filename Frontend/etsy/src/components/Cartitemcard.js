import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useDispatch } from "react-redux";
import { setCannotCheckOut } from "../reducers/checkoutSlice";

function Cartitemcard(props) {
  const [outOfStock, setOutOfStock] = useState("");
  const [options, setOptions] = useState("");
  const [isGift, setIsGift] = useState(props.item.isGift);
  const currency = localStorage.getItem("currency").split(" ")[0];

  const dispatch = useDispatch();

  useEffect(() => {
    let arr = [];
    for (let i = 0; i < props.item.quantity; i++) {
      arr.push(i + 1);
    }
    setOptions(arr.map((val) => <option>{val}</option>));
    if (parseInt(props.item.quantityRequested) > props.item.quantity) {
      setOutOfStock(
        <h6 style={{ color: "red" }}>
          Sorry, these items got sold. Please request for different quantity if
          available.{" "}
        </h6>
      );
      dispatch(setCannotCheckOut());
    }
  }, [dispatch, props.item.quantity, props.item.quantityRequested]);

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
                  Price: {currency} {props.item.price}
                </div>
                <div style={{ display: "inline-block", marginLeft: "150px" }}>
                  Quantity: &emsp;
                  <select id="quantity_options">
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
                  <input type="checkbox" checked={isGift} /> This order is a
                  gift
                  <span class="checkmark"></span>
                </label>
                <div style={{ marginLeft: "850px" }}>
                  <button type="button" class="btn btn-link">
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
