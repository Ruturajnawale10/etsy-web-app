import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";
import config from "./configs/config.js";
import Users from "./models/UserModel.js";
import Favourites from "./models/FavouritesModel.js";
import Items from "./models/ItemModel.js";
import Orders from "./models/OrderModel.js";
import Shops from "./models/ShopModel.js";
import jwt from "jsonwebtoken";
import { checkAuth } from "./utils/passport.js";
import { auth } from "./utils/passport.js";

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(config.mongo.mongoDBURL, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log("MongoDB connection Failed");
  } else {
    console.log("MongoDB connected");
  }
});

// The GraphQL schema
const typeDefs = gql`
  input UserInput {
    id: String
    username: String
    password: String
    email: String
    name: String
    about: String
    city: String
    phone: String
    address: String
    country: String
    birthdate: String
    gender: String
    imageName: String
  }
  type Order {
    id: ID
    itemId: String
    userId: String
  }
  type LoginResponse {
    id: ID
    msg: String
    jwt: String
  }
  type User {
    id: String
    username: String
    email: String
    password: String
    name: String
    about: String
    city: String
    phone: String
    address: String
    country: String
    birthdate: String
    gender: String
    imageName: String
  }
  input ShopInput {
    shopName: String
    userName: String
  }
  type Shop {
    shopName: String
    shopOwner: String
    totalSales: String
  }
  input ItemInput {
    itemName: String
    shopName: String
    username: String
    category: String
    description: String
    price: Int
    quantity: Int
    sales: Int
    imageName: String
  }
  type Item {
    itemName: String
    shopName: String
    itemOwner: String
    category: String
    description: String
    price: Int
    quantity: Int
    sales: Int
    imageName: String
  }
  input ItemOrderInput {
    user_id: String
    orderID: String
    itemName: String
    price: String
    quantity: Int
    quantityRequested: Int
    date: String
    imageName: String
    shopName: String
    isGift: Boolean
  }
  type ItemOrder {
    user_id: String
    orderID: String
    itemName: String
    price: String
    quantityRequested: Int
    quantity: Int
    date: String
    imageName: String
    shopName: String
    isGift: Boolean
  }
  type Query {
    users: String
    getUser(user: UserInput): User
    checkIfUserCreatedShop(user: UserInput): String
    checkShopnameAvailability(shop: ShopInput): String
    getAllItems(user: UserInput): [Item]
    getItemDetails(item: ItemInput): Item
    getCartItems(user: UserInput): [ItemOrder]
  }
  type Mutation {
    loginUser(user: UserInput): LoginResponse
    addUser(user: UserInput): String
    updateUser(user: UserInput): String
    createShop(shop: ShopInput): String
    addItem(item: ItemInput): String
    addToCart(user: ItemOrderInput): String
    addOrder(itemId: ID): Order
  }
`;

const users = [];
const orders = [];

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    getUser: async (parent, { user }, context) => {
      console.log("Inside Get user profile Query Request");
      const { id } = user;
      console.log("Seee this dude: ", id);
      const result = await Users.findOne({ _id: id });
      console.log(result);
      return result;
    },
    checkIfUserCreatedShop: async (parent, { user }, context) => {
      console.log("Inside check if shop exists graphql query Request");
      const { username } = user;
      const result = await Users.findOne({ "shop.shopOwner": username });
      if (result) {
        return result.shop.shopName;
      } else {
        return "shopname not registered";
      }
    },
    checkShopnameAvailability: async (parent, { shop }, context) => {
      console.log("Inside if shopname is available graphql query Request");
      const { shopName } = shop;
      const result = await Users.findOne({ "shop.shopName": shopName });
      if (result) {
        return "not available";
      } else {
        return "available";
      }
    },
    getAllItems: async (parent, { user }, context) => {
      console.log("Inside Get All items in dashboard Query Request");
      const { username } = user;
      const items = await Items.find({ itemOwner: { $ne: username } });
      return items;
    },
    getItemDetails: async (parent, { item }, context) => {
      console.log("Inside Get Item Details Query Request");
      const { itemName } = item;

      const itemDetails = await Items.findOne({ itemName: itemName });
      return itemDetails;
    },
    getCartItems: async (parent, { user }, context) => {
      console.log("Inside Get Cart items Query Request");
      const { id } = user;
      let items = [];

      let user1 = await Users.findOne({ _id: id });

      for (let i = 0; i < user1.cartItems.length; i++) {
        let item1 = await Items.findOne({
          itemName: user1.cartItems[i].itemName,
        });
        items.push({
          itemName: user1.cartItems[i].itemName,
          quantityRequested: user1.cartItems[i].quantityRequested,
          price: item1.price,
          quantity: item1.quantity,
          isGift: user1.cartItems[i].isGift,
        });
      }
      return items;
    },
  },
  Mutation: {
    loginUser: async (parent, { user }, context) => {
      console.log("Inside Login Query Request");
      const { username, password } = user;
      console.log(username, "  ", password);
      const result = await Users.findOne({
        username: username,
        password: password,
      });
      if (result) {
        console.log("Success");
        const payload = { _id: result._id, username: result.username };
        const token = jwt.sign(payload, config.mongo.secret, {});
        let JWT = "JWT " + token;
        return {
          id: context.session.id,
          msg: "SUCCESS",
          jwt: JWT,
        };
      } else {
        console.log("Invalid creds");
        return {
          msg: "Invalid credentials",
          jwt: null,
        };
      }
    },
    addUser: async (parent, { user }, context) => {
      console.log("Inside Register Mutation Request");
      console.log(user);
      const { username, password, email } = user;

      var new_user = new Users({
        username: username,
        password: password,
        email: email,
      });
      var favourites = new Favourites({
        userName: username,
        items: [],
      });
      var orders = new Orders({
        userName: username,
        orderItems: [],
      });

      const result = await Users.findOne({ username: username });
      if (result) {
        return "ALREADY EXISTS";
      } else {
        console.log("New user");
        new_user.save(new_user);
        favourites.save(favourites);
        orders.save(orders);
        return "SUCCESS";
      }
    },
    updateUser: async (parent, { user }, context) => {
      console.log("Inside Update User Mutation Request");
      console.log(user);
      const {
        id,
        name,
        about,
        city,
        email,
        phone,
        address,
        country,
        birthdate,
        gender,
      } = user;

      let result = await Users.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name: name,
            about: about,
            city: city,
            email: email,
            phone: phone,
            address: address,
            country: country,
            birthdate: birthdate,
            gender: gender,
          },
        }
      );
      if (result) {
        return "SUCCESS";
      } else {
        return "FAILURE";
      }
    },
    createShop: async (parent, { shop }, context) => {
      console.log("Inside create shop graphql mutation Request");
      const { shopName, userName } = shop;
      let newshop = new Shops({
        shopName: shopName,
        shopOwner: userName,
        totalSales: 0,
      });

      const result = await Users.findOneAndUpdate(
        { username: userName },
        {
          $set: {
            shop: newshop,
          },
        }
      );
      if (result) {
        return "SUCCESS";
      } else {
        return "FAILURE";
      }
    },
    addItem: async (parent, { item }, context) => {
      console.log("Inside AddItem mutation graphql Request");
      const {
        itemName,
        shopName,
        username,
        category,
        description,
        price,
        quantity,
        imageName,
      } = item;

      let newitem = new Items({
        itemName: itemName,
        shopName: shopName,
        itemOwner: username,
        category: category,
        description: description,
        price: price,
        quantity: quantity,
        imageName: imageName,
      });
      newitem.save(newitem);
    },
    addToCart: async (parent, { item }, context) => {
      console.log("Inside Add item to cart mutation graphql Request");

      const { itemName, quantityRequested, user_id } = item;

      let response = await Users.findOneAndUpdate(
        { _id: user_id },
        {
          $push: {
            cartItems: {
              itemName: itemName,
              quantityRequested: quantityRequested,
              isGift: false,
            },
          },
        }
      );

      if (response) {
        return "SUCCESS";
      } else {
        return "FAILURE";
      }
    },
    addOrder: async (parent, { itemId }, context) => {
      const newOrder = {
        id: orders.length,
        userId: context.session.id,
        itemId,
      };
      orders.push(newOrder);
      return newOrder;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { session: { id: 1 } };
  },
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
