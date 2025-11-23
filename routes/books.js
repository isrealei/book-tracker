import express from "express";
import {
  getAllBooks,
  addNewBook,
  renderNewBookPage,
  renderEditPage,
  deleteBook,
  editBookReview,
} from "../controllers/bookControllers.js";
import ensureAuthenticated from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllBooks);
router.post("/add", ensureAuthenticated, addNewBook);
router.get("/new", ensureAuthenticated, renderNewBookPage);
router.get("/edit/:id", ensureAuthenticated, renderEditPage);
router.post("/edit/:id", ensureAuthenticated, editBookReview);
router.get("/delete/:id", ensureAuthenticated, deleteBook);

export default router;
