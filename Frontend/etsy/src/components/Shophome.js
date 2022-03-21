import React, { useState, useEffect } from "react";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Additem from "./Popup/Additem";
import "../App.css";

function Shophome(props) {
  let redirectVar = null;
  if (!cookie.load("cookie")) {
    redirectVar = <Redirect to="/login" />;
  }

  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [shouldDisplayImage, setShouldDisplayImage] = useState("none");
  const [msg, setMsg] = useState(null);
  const [fetchedImage, setFetchedImage] = useState(null);
  const [showEdit, setShowEdit] = useState("none");
  const [totalSales, setTotalSales] = useState(null);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(process.env.REACT_APP_LOCALHOST + "/getitems", {
        params: {
          shopName: props.name,
        },
      })
      .then((response) => {
        if (response.data[0].isOwner === "NO") {
          setShowEdit("block");
        }

        
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

  const setProfileImage = async (e) => {
    e.preventDefault();
    const convertedFile = await convertToBase64(imageFile);
    const s3URL = await axios.post(
      process.env.REACT_APP_LOCALHOST + "/upload",
      {
        image: convertedFile,
        imageName: imageFile.name,
      }
    );
    setMsg(
      <p style={{ fontSize: 30, color: "green", marginRight: 50 }}>
        Profile Image updated!
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

      <div style={{ display: showEdit }}>
      <br></br>
        <div>
          Edit Shop Image:
          <input
            type="file"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              setShouldDisplayImage("block");
            }}
          ></input>
          <button
            class="btn btn-dark"
            style={{ display: shouldDisplayImage }}
            onClick={setProfileImage}
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
