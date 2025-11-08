import dotenv from "dotenv"
import express from "express";
import bodyParser from "body-parser";
import { dbConnect } from "./config/db.js";
import bookRoutes from "./routes/books.js";
import authRoutes from "./routes/auth.js";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "./config/passport.js";


dotenv.config();


const app = express();
const port = 4000;

// PostgreSQL client setup
dbConnect();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Session setup
app.use(session({
    secret: process.env.SESSION_TOKEN,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Routes
app.use("/", bookRoutes);
app.use("/auth", authRoutes)


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

