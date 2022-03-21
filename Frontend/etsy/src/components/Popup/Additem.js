import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "./Container";
import "./index.css";

const Additem = (props) => {
  let [alert, setAlert] = useState(null);
  let [updatealert, setUpdatealert] = useState(null);

  const convertToBase64 = (imageFile) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("onSubmit line");
    console.log(e.target);

    let data = {
      item_name: e.target.name.value,
      shop_name: props.name,
      category: e.target.category.value,
      description: e.target.description.value,
      price: e.target.price.value,
      quantity: e.target.quantity.value,
    };

    let imageFile = e.target[0].files[0];
    if (imageFile === undefined) {
      setAlert("Please add an image of the item");
    } else {
      const convertedFile = await convertToBase64(imageFile);

      const s3URL = await axios.post(
        process.env.REACT_APP_LOCALHOST + "/additem",
        {
          ...data,
          image: convertedFile,
          imageName: imageFile.name,
        }
      );

      setAlert(
        <p style={{ fontSize: 30, color: "green", marginRight: 50 }}>
          Item Inserted!
        </p>
      );
    }
  };

  const onUpdateSubmit = async (e) => {
    e.preventDefault();

    let data = {
      item_name: e.target.name.value,
      shop_name: props.name,
      category: e.target.category.value,
      description: e.target.description.value,
      price: e.target.price.value,
      quantity: e.target.quantity.value,
    };

    let imageFile = e.target[0].files[0];
    if (imageFile !== undefined) {
      console.log("hahahaha");
      const convertedFile = await convertToBase64(imageFile);
      const response = await axios.post(
        process.env.REACT_APP_LOCALHOST + "/updateitem",
        {
          ...data,
          image: convertedFile,
          imageName: imageFile.name,
        }
      );
      if (response === "SUCCESS") {
        setUpdatealert(
          <p style={{ fontSize: 30, color: "green", marginRight: 50 }}>
            Item Updated!
          </p>
        );
      }
    } else {
      const response = await axios.post(
        process.env.REACT_APP_LOCALHOST + "/updateitem",
        {
          ...data,
          image: null,
          imageName: null,
        }
      );
      if (response === "SUCCESS") {
        setUpdatealert(
          <p style={{ fontSize: 30, color: "green", marginRight: 50 }}>
            Item Updated!
          </p>
        );
      }
    }
  };

  return (
    <div className="Additem" style={{ marginLeft: 0 }}>
      <div style={{ display: "inline-block" }}>
        <Container triggerText="Add Item" onSubmit={onSubmit} />
        {alert}
      </div>

      <div style={{ display: "inline-block", marginLeft: "100px" }}>
        <Container triggerText="Edit Item" onSubmit={onUpdateSubmit} />
        {updatealert}
      </div>
    </div>
  );
};

export default Additem;
