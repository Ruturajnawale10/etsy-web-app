import React, { useState } from "react";
import axios from "axios";
import { Container } from "./Container";
import imagesService from "../../utils/imagesService.js";
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


    let imageFile = e.target[0].files[0];
    if (imageFile === undefined) {
      setAlert("Please add an image of the item");
      //window.location.reload(false);
    } else {
      const base64Image = await convertToBase64(imageFile);
      let imageName = imageFile.name;
      imageName = `items/${imageName}`;
      let s3ImageURL = await imagesService.upload( imageName, base64Image);
      console.log("S3 img url is: ", s3ImageURL);

      const qlQuery = async (query, variables = {}) => {
        const resp = await fetch("http://localhost:4001", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });
        return (await resp.json()).data;
      };

      (async () => {
        // Mutation additem
        let response = await qlQuery(
          "mutation _($itemInput: ItemInput) {addItem(item: $itemInput)}",
          {
            itemInput: {
              itemName: e.target.name.value,
              shopName: props.name,
              username: localStorage.getItem("username"),
              category: e.target.category.value,
              description: e.target.description.value,
              price: parseInt(e.target.price.value),
              quantity: parseInt(e.target.quantity.value),
              imageName: s3ImageURL,
            },
          }
        );
        window.location.reload();
      })();

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
