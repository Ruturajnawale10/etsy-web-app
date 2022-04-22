import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt as ExtractJwt } from "passport-jwt";
import passport from "passport";
import Users from "../models/UserModel.js";
import config from "../configs/config.js";

export function auth() {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: config.mongo.secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwt_payload, callback) => {
      const user_id = jwt_payload._id;
      Users.findById(user_id, (err, results) => {
        if (err) {
          console.log("Error is here", err);
          return callback(err, false);
        }
        if (results) {
          console.log("Success is here", results);
          callback(null, results);
        } else {
          console.log("why Error is here", err);
          callback(null, false);
        }
      });
    })
  );
}

export const checkAuth = passport.authenticate("jwt", { session: false });
