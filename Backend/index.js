import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";
import config from "./configs/config.js";
import Users from "./models/UserModel.js";
import Favourites from "./models/FavouritesModel.js";
import Items from "./models/ItemModel.js";
import Orders from "./models/OrderModel.js";
import Shops from "./models/ShopModel.js";

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
  type User {
    id: ID
    name: String
    email: String
    password: String
  }
  type Query {
    users: [User]
  }
  type Mutation {
    addUser(user: UserInput): User
    addOrder(itemId: ID): Order
  }
`;

const users = [];
const orders = [];

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    users: async () => {
      return users;
    },
  },
  Mutation: {
    addUser: async (parent, { user }, context) => {
      console.log("Inside Register Mutation Request");
      console.log(user);
      let username = user.username;
      let password = user.password;
      let email = user.email;

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

      Users.findOne({ username: username }, (error, user) => {
        if (error) {
          console.log("Failed", error);
          return "FAILURE";
        } else if (user) {
          console.log("Duplicate");
          return "ALREADY EXISTS";
        } else {
          console.log("New user");
          new_user.save((error) => {
            if (error) {
              return "FAILURE";
            } else {
              favourites.save((error1) => {
                if (error1) {
                  return "FAILURE";
                } else {
                  orders.save((error2) => {
                    if (error2) {
                      return "FAILURE";
                    } else {
                      return "SUCCESS";
                    }
                  });
                }
              });
            }
          });
        }
      });
      // const newUser = {...user, id: users.length};
      // users.push(newUser);
      // return newUser;
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
