import React, { useState, useEffect } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Additem from "./Popup/Additem";
import '../App.css';

function Shophome(props) {
  let redirectVar = null;
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  var [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getitems", {
        params: {
          shopName: props.name,
        },
      })
      .then((response) => {
        setItems(
          <table id="items_in_shop">
            <tr>
              <th>Item name</th>
              <th>Sales</th>
            </tr>
            {response.data.map((item, i) => {
              return (
                <tr key={i} value={item}>
                  <td>{item.item_name}</td>
                  <td>{item.sales}</td>
                </tr>
              );
            })}
          </table>
        );
      });
  }, []);

  return (
    <div>
      {redirectVar}
      <h1>{props.name}</h1>
      <Additem name={props.name} />
      <h4>List of Items in the Shop:</h4>

      {items}
    </div>
  );
}

export default Shophome;
