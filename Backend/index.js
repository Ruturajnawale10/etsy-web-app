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
    username: String
    password: String
    email: String
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
    username: String
    email: String
    password: String
  }
  type Query {
    users: String
  }
  type Mutation {
    loginUser(user: UserInput): LoginResponse
    addUser(user: UserInput): String
    addOrder(itemId: ID): Order
  }
`;

const users = [];
const orders = [];

// A map of functions which return data for the schema.
const resolvers = {
  Query: {},
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
        const payload = { _id: user._id, username: user.username };
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
