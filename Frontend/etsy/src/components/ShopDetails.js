import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import "../App.css";

function ShopDetails() {
  let redirectVar = null;
  if (!localStorage.getItem("token")) {
    redirectVar = <Redirect to="/login" />;
  }

  let url = document.location.href;
  let url_arr = url.split("/");
  let item_namee = url_arr.pop();
  item_namee = item_namee.replaceAll("%20", " ").trim();
  const [itemName, setItemName] = useState(item_namee);

  const [items, setItems] = useState([]);
  const [user, setUser] = useState([]);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [totalSales, setTotalSales] = useState(null);

  useEffect(() => {
    setItemName(item_namee);
    axios.defaults.headers.common["authorization"] =
      localStorage.getItem("token");
    axios
      .get(process.env.REACT_APP_LOCALHOST + "/items/shopdetails", {
        params: {
          shopName: itemName,
        },
      })
      .then((response) => {
        let total = 0;
        setUser(response.data.user);

        for (let sales in response.data.items) {
          total += sales;
        }
        setTotalSales(total);
        setItems(
          <table id="items_in_shop">
            <tr>
              <th>Item name</th>
              <th>Sales</th>
            </tr>
            {response.data.items.map((item, i) => {
              return (
                <tr key={i} value={item}>
                  <td>{item.itemName}</td>
                  <td>{item.sales}</td>
                </tr>
              );
            })}
          </table>
        );

        if (response.data.image != null) {
          setFetchedImage(
            <img
              src={"data:image/jpeg;base64," + response.data.image}
              alt="Red dot"
              width={300}
              height={300}
              class="img-fluid"
            ></img>
          );
        }

        if (response.data.userImage != null) {
          setUserImage(
            <img
              src={"data:image/jpeg;base64," + response.data.userImage}
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
      <div class="container">
       <div class="row">
        <div class="col-md-8">
        {fetchedImage}
        </div>
        <div class="col-md-4">
        {userImage}
        <p style={{fontSize: "25px", marginTop:"30px"}}>Name: {user.username}</p>
        <p style={{fontSize: "25px", marginTop:"20px"}}>Contact: {user.phone}</p>
        <p style={{fontSize: "25px", marginTop:"10px", color: "blue"}}>Shop owner details</p>
        </div>
       </div>
      </div>

      
      <div>
        <br></br>
      </div>
      <h4>List of Items in the Shop:</h4>
      {items}

      <p style={{fontSize: "25px", marginTop:"30px"}}>Total sales: {totalSales}</p>
    </div>
  );
}

export default ShopDetails;
