import express from "express";
import {
    getAllBooks, 
    addNewBook, 
    renderNewBookPage, 
    renderEditPage, 
    deleteBook, 
    editBookReview
} from "../controllers/bookControllers.js";

const router = express.Router();

router.get("/", getAllBooks);
router.post("/add", addNewBook);
router.get("/new", renderNewBookPage);
router.get("/edit/:id", renderEditPage);
router.post("/edit/:id", editBookReview);
router.get("/delete/:id", deleteBook)

export default router;