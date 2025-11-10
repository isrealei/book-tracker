import express from "express";
import {
    signUpPage,
    registerNewUser,
    renderLoginPage,
    logOutUser,
} from "../controllers/authControllers.js";
import passport from "passport";

const router = express.Router();

router.get("/signup", signUpPage);
router.post("/signup", registerNewUser);

router.get("/login", renderLoginPage);
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login"
}));

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback/", 
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/auth/login"
    })
);

router.get("/logout", logOutUser);

export default router;