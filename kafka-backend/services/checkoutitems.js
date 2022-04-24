"use strict";
import Users from "../models/UserModel.js";
import Items from "../models/ItemModel.js";
import ItemOrders from "../models/ItemOrderModel.js";
import Orders from "../models/OrderModel.js";

async function handle_request(msg, callback) {
  console.log("In handle request:" + JSON.stringify(msg));
  console.log("Checking out items request...");
  let userID = msg.userID;
  let userName = msg.userName;
  let orderID = msg.orderID;

  let date = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    Date.now()
  );

  Users.findOne({ _id: userID }, function (err, user) {
    if (err) {
      callback(err, "FAILURE");
    } else {
      if (!user.address) {
        callback(err, "FILL ADDRESS");
      } else {
        let itemNameArr = [];
        for (let i = 0; i < user.cartItems.length; i++) {
          itemNameArr.push(user.cartItems[i].itemName);
        }

        Items.find({ itemName: { $in: itemNameArr } }, function (err, item) {
          let orderList = [];
          for (let i = 0; i < item.length; i++) {
            let itemOrder = new ItemOrders({
              orderID: orderID,
              itemName: item[i].itemName,
              price: item[i].price,
              quantity: user.cartItems[i].quantityRequested,
              date: date,
              imageName: item[i].imageName,
              shopName: item[i].shopName,
              isGift: user.cartItems[i].isGift,
              note: user.cartItems[i].note,
            });
            orderList.push(itemOrder);
          }

          Orders.findOneAndUpdate(
            { userName: userName },
            {
              $push: {
                orderItems: {
                  $each: orderList,
                },
              },
            },
            (error) => {
              if (error) {
                callback(error, "FAILURE");
              } else {
                Users.findOneAndUpdate(
                  { username: userName },
                  {
                    $set: {
                      cartItems: [],
                    },
                  },
                  function (err, doc) {
                    if (err) {
                        callback(error, "FAILURE");
                    } else {
                      function updateStock(item, i) {
                        return new Promise((resolve) => {
                          Items.findOneAndUpdate(
                            { itemName: item[i].itemName },
                            {
                              $set: {
                                quantity:
                                  item[i].quantity -
                                  parseInt(user.cartItems[i].quantityRequested),
                                sales:
                                  item[i].sales +
                                  parseInt(user.cartItems[i].quantityRequested),
                              },
                            },
                            function (err, item3) {
                              if (err) {
                                callback(error, "FAILURE");
                              } else {
                                console.log("Updated the quantity!");
                                resolve(item3);
                              }
                            }
                          );
                        });
                      }

                      let promises = [];
                      for (let i = 0; i < item.length; i++) {
                        promises.push(updateStock(item, i));
                      }

                      Promise.all(promises)
                        .then(() => {
                            callback(null, "SUCCESS");
                        })
                        .catch((e) => {
                            callback(error, "FAILURE");
                        });
                    }
                  }
                );
              }
            }
          );
        });
      }
    }
  });
  
}

export default handle_request;
