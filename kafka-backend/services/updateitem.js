"use strict";
import Items from "../models/ItemModel.js";
import imagesService from "../utils/imagesService.js";

async function handle_request(msg, callback) {
  console.log("In Kafka handle request:" + JSON.stringify(msg));
  let itemName = msg.itemName;
  let category = msg.category;
  let description = msg.description;
  let price = msg.price;
  let quantity = msg.quantity;

  let imageName = msg.imageName;
  const base64Image = msg.image;
  imageName = `items/${imageName}`;

  if (base64Image === null) {
    Items.findOneAndUpdate(
      { itemName: itemName },
      {
        $set: {
          category: category,
          description: description,
          price: price,
          quantity: quantity,
        },
      },
      function (err, doc) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, "SUCCESS");
        }
      }
    );
  } else {
    try {
      const imageName = "items/" + req.body.imageName;
      let response = await imagesService.upload(imageName, base64Image);
      Items.findOneAndUpdate(
        { itemName: itemName },
        {
          $set: {
            category: category,
            description: description,
            price: price,
            quantity: quantity,
            imageName: imageName,
          },
        },
        function (err, doc) {
          if (err) {
            callback(err, null);
          } else {
            callback(null, "SUCCESS");
          }
        }
      );
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
      callback(err, null);
    }
  }
}

export default handle_request;
