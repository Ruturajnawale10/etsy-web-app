import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container } from "./Container";
import "./index.css";

const Additem = (props) => {
  const triggerText = "Add Item";
  let [alert, setAlert] = useState(null);

  //   const convertedFile = await convertToBase64(imageFile);
  //   const s3URL = await axios.post("http://localhost:3001/additem", {
  //     image: convertedFile,
  //     imageName: imageFile.name,
  //   });

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

    const convertedFile = await convertToBase64(imageFile);
    console.log("add item line");
    console.log(data);
    console.log(imageFile.name);
    //console.log(convertedFile);

    const s3URL = await axios.post("http://localhost:3001/additem", {
      ...data,
      image: convertedFile,
      imageName: imageFile.name,
    });

    setAlert(
      <p style={{ fontSize: 30, color: "green", marginRight: 50 }}>
        Item Inserted!
      </p>
    );
  };

  return (
    <div className="Additem" style={{ marginLeft: 0 }}>
      <p style={{ fontSize: 20 }}>Add a new item in the store</p>
      <div>
        <Container triggerText={triggerText} onSubmit={onSubmit} />
        {alert}
      </div>
    </div>
  );
};

export default Additem;
