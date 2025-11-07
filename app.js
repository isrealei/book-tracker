import dotenv from "dotenv"
import express from "express";
import bodyParser from "body-parser";
import { dbConnect } from "./config/db.js";
import bookRoutes from "./routes/books.js";
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

// Routes
app.use("/", bookRoutes);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

