import React, { useState, useEffect } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Additem from "./Popup/Additem";
import "../App.css";

function ShopDetails() {
  let redirectVar = null;
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  let url = document.location.href;
  let url_arr = url.split("/");
  let item_namee = url_arr.pop();
  item_namee = item_namee.replaceAll("%20", " ").trim();
//   console.log(item_name);
   const [itemName, setItemName] = useState(item_namee);
//    setItemName(item_name);

  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [displayButton, setDisplayButton] = useState("none");
  const [msg, setMsg] = useState(null);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [totalSales, setTotalSales] = useState(null);

  useEffect(() => {
      setItemName(item_namee);
    axios.defaults.withCredentials = true;
    axios
      .get(process.env.REACT_APP_LOCALHOST + "/getitems" , {
          
        params: {
          shopName: itemName,
        },
      })
      .then((response) => {
       
        let total = 0;
        for (let sales in response.data) {
          total += parseInt(sales);
        }
        setTotalSales(total);
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

        if (response.data[0].image != null) {
          setFetchedImage(
            <img
              src={"data:image/jpeg;base64," + response.data[0].image}
              alt="Red dot"
              width={300}
              height={300}
              class="img-fluid"
            ></img>
          );
        }
      });
  }, []);

  const convertToBase64 = (imageFile) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  return (
    <div>
      {redirectVar}
      <h1>{itemName}</h1>
      <div class="row g-3 align-items-center">
        <div class="col-auto"></div>
      </div>
      {fetchedImage}
      <div>
        <br></br>
      </div>
      <h4>List of Items in the Shop:</h4>

      {items}
    </div>
  );
}

export default ShopDetails;
