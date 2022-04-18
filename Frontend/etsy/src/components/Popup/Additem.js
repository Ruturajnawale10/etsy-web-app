import React, { useState } from "react";
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

    let data = {
      itemName: e.target.name.value,
      shopName: props.name,
      category: e.target.category.value,
      description: e.target.description.value,
      price: e.target.price.value,
      quantity: e.target.quantity.value,
    };

    let imageFile = e.target[0].files[0];
    if (imageFile === undefined) {
      setAlert("Please add an image of the item");
      //window.location.reload(false);
    } else {
      const convertedFile = await convertToBase64(imageFile);
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");

      const s3URL = await axios.post(
        process.env.REACT_APP_LOCALHOST + "/your/shop/additem",
        {
          ...data,
          image: convertedFile,
          imageName: imageFile.name,
        }
      );

      window.location.reload(false);
    }
  };

  const onUpdateSubmit = async (e) => {
    e.preventDefault();

    let data = {
      itemName: e.target.name.value,
      shopName: props.name,
      category: e.target.category.value,
      description: e.target.description.value,
      price: e.target.price.value,
      quantity: e.target.quantity.value,
    };

    let imageFile = e.target[0].files[0];
    if (imageFile !== undefined) {
      const convertedFile = await convertToBase64(imageFile);
      const response = await axios.post(
        process.env.REACT_APP_LOCALHOST + "/your/shop/updateitem",
        {
          ...data,
          image: convertedFile,
          imageName: imageFile.name,
        }
      );
      if (response.data === "SUCCESS") {
        window.location.reload(false);
      }
    } else {
      const response = await axios.post(
        process.env.REACT_APP_LOCALHOST + "/your/shop/updateitem",
        {
          ...data,
          image: null,
          imageName: null,
        }
      );
      if (response.data === "SUCCESS") {
        window.location.reload(false);
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
