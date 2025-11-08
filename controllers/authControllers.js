import {createUser} from "../models/userModel.js";
import { dbConnect } from "../config/db.js";
const db = dbConnect();

export async function signUpPage(req, res) {
    res.render("signup.ejs");
};

export async function registerNewUser(req, res) {
    const { username, password } = req.body;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);
    if (checkResult.rows.length > 0) {
        res.send("Email already exists. Try logging in.");
    } else {
        console.log("I am here")
        await createUser(username, password);
        res.render("login.ejs");
  }
    } catch (err) {
    console.log(err);
    }
};

export async function renderLoginPage(req, res) {
    res.render("login.ejs")
}


export async function logOutUser(req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
        }
    );
};