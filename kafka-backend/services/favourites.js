"use strict";
import Favourites from "../models/FavouritesModel.js";

function handle_request(msg, callback) {
  console.log("In handle request:" + JSON.stringify(msg));
  let userName = msg.userName;

  let item = msg.item;
  let isFavourite = msg.isFavourite;

  if (isFavourite === "YES") {
    Favourites.findOneAndUpdate(
      { userName: userName },
      {
        $pull: { items: { itemName: item.itemName } },
      },
      (error, result) => {
        if (error) {
          callback(err, null);
        } else {
          callback(null, "SUCCESS");
        }
      }
    );
  } else {
    console.log("Adding to favourites");
    Favourites.findOneAndUpdate(
      { userName: userName },
      {
        $push: { items: item },
      },
      (error, result) => {
        if (error) {
          callback(error, null);
        } else {
          callback(error, "SUCCESS");
        }
      }
    );
  }
}

export default handle_request;
