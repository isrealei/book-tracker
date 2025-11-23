import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import {
  findUserByUserName,
  createUser,
  findUserById,
} from "../models/userModel.js";
import { dbConnect } from "./db.js";
const db = dbConnect();

export function configurePassport(passport) {
  passport.use(
    "local",
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
}

export function configureGooglePassportStrategy(passport) {
  console.log("start");
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/auth/google/callback/",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          // console.log(profile)
          // check if email already present in db
          const user = await findUserByUserName(profile.email);
          if (user.length === 0) {
            // create new user
            const newUser = await db.query(
              "INSERT INTO users (email, password) VALUES ($1, $2)",
              [profile.email, profile.id]
            );
            return cb(null, newUser.rows[0]);
          } else {
            return cb(null, user);
          }
        } catch (err) {
          return cb(err);
        }
      }
    )
  );
}

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await findUserById(id);
  cb(null, user);
});
