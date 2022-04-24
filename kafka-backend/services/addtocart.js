"use strict";
import Users from "../models/UserModel.js";

async function handle_request(msg, callback) {
  console.log("In handle request:" + JSON.stringify(msg));
  let userID = msg.userID;
  let itemName = msg.itemName;
  let quantityRequested = msg.quantityRequested;
  Users.findOneAndUpdate(
    { _id: userID },
    {
      $push: {
        cartItems: {
          itemName: itemName,
          quantityRequested: quantityRequested,
          isGift: false,
        },
      },
    },
    function (err, doc) {
      if (err) {
        callback(err, []);
      } else {
        callback(null, doc);
      }
    }
  );
}

export default handle_request;
