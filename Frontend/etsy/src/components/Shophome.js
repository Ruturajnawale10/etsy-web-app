import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router";
import Additem from "./Popup/Additem";
import "../App.css";

function Shophome(props) {
  let redirectVar = null;
  if (!localStorage.getItem("token")) {
    redirectVar = <Redirect to="/login" />;
  }

  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [displayButton, setDisplayButton] = useState("none");
  const [msg, setMsg] = useState(null);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [totalSales, setTotalSales] = useState(null);

  useEffect(() => {
    axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
    axios
      .get(process.env.REACT_APP_LOCALHOST + "/your/shop/getitems", {
        params: {
          shopName: props.name,
        },
      })
      .then((response) => {
        let total = 0;
        for (let i = 0; i <  response.data.items.length; i++) {
          total += parseInt(response.data.items[i].sales);
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

  const setProfileImage = async (e) => {
    e.preventDefault();
    const convertedFile = await convertToBase64(imageFile);
    axios.defaults.headers.common["authorization"] =
    localStorage.getItem("token");
    const s3URL = await axios.post(
      process.env.REACT_APP_LOCALHOST + "/your/shop/uploadshopimage",
      {
        image: convertedFile,
        imageName: imageFile.name,
      }
    );
    setMsg(
      <p style={{ fontSize: 30, color: "green", marginRight: 50 }}>
        Shop Image updated!
      </p>
    );
  };

  return (
    <div>
      {redirectVar}
      <h1>{props.name}</h1>
      <div class="row g-3 align-items-center">
        <div class="col-auto">
        </div>
      </div>
      {fetchedImage}

      <div>
      <br></br>
        <div>
          Edit Shop Image:
          <input
            type="file"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              setDisplayButton("block");
            }}
          ></input>
          <button
            class="btn btn-dark"
            onClick={setProfileImage}
            style={{display: displayButton}}
          >
            Update
          </button>
        </div>
        {msg}
        <br></br>

        <Additem name={props.name} />
      </div>
      <h4>List of Items in the Shop:</h4>

      {items}

    <br></br>
      <h3>Total Sales is: {totalSales} </h3>
    </div>
  );
}

export default Shophome;
