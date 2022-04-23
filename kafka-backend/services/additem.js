"use strict";
import Items from "../models/ItemModel.js";
import imagesService from "../utils/imagesService.js";

async function handle_request(msg, callback) {
  console.log("In handle request:" + JSON.stringify(msg));
  let userName = msg.userName;
  let itemName = msg.itemName;
  let shopName = msg.shopName;
  let category = msg.category;
  let description = msg.description;
  let price = msg.price;
  let quantity = msg.quantity;
  let imageName = msg.imageName;
  const base64Image = msg.image;
  imageName = `items/${imageName}`;

  try {
    let response = await imagesService.upload(imageName, base64Image);

    let item = new Items({
      itemName: itemName,
      shopName: shopName,
      itemOwner: userName,
      category: category,
      description: description,
      price: price,
      quantity: quantity,
      imageName: imageName,
    });
    item.save(item, (error, shop) => {
      if (item) {
        callback(null, "SUCCESS");
      } else {
        callback(error, null);
      }
    });
  } catch (err) {
    console.error(`Error uploading image: ${err.message}`);
    callback(err, null);
  }
}

export default handle_request;
