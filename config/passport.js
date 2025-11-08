import {Strategy} from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";
import {findUserByUserName, createUser, findUserById} from "../models/userModel.js";

export function configurePassport(passport) {
  passport.use(
    new Strategy(async function verify(username, password, cb) {
      try {
        const user = await findUserByUserName(username);

        if (!user) {
          // no user found — return once
          return cb(null, false, { message: "User not found" });
        }

        // await instead of callback
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return cb(null, false, { message: "Incorrect password" });
        }

        // success
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    })
  );
};

passport.serializeUser((user, cb) => {
    cb(null, user.id);
});

passport.deserializeUser( async (id, cb) => {
    const user = await findUserById(id);
    cb(null, user);
});