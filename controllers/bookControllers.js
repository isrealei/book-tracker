import { querryAllBooks, addBook, getBookById, updateReview, deleteBookAndReview } from "../models/bookModels.js";
import fetchBookData from "../utils/fetchBookData.js";

export async function getAllBooks(req, res) {
   const books = querryAllBooks();
    res.render("index.ejs", { books: await books });
};

export async function renderNewBookPage(req, res) {
    res.render("new.ejs")
};

export async function addNewBook(req, res) {
     // Check if body exists and is not empty
     if (!req.body) {
        return res.status(400).json({"error": "Request body cannot be empty"});
    }
    
    const { book_title, date_read, rating, summary } = req.body;
    // validate book title
    if (!book_title || book_title.trim() === "") {
        return res.json({"msg": "book title must not be left empty"})
    };

    // fetch data from API
    const bookData =  await fetchBookData(book_title);
    console.log(bookData)

    // handle API response safely
    if (bookData.msg === "Book could not be found") {
       console.log("input the book tile and author manually")
        return res.redirect("/");
    }

    if (bookData.msg === "There was an api error") {
       console.log("There was an api errror when trying to get the book details")
       return res.redirect("/");
    }

    await addBook(bookData, date_read, rating, summary);
    return res.redirect("/");
};

export async function renderEditPage(req, res) {
    console.log(req.user);
    const bookId = req.params.id;
    const book = await getBookById(bookId);
    res.render("edit.ejs", { book: book });
};


export async function editBookReview(req, res) {
    const bookId = req.params.id;
    const { date_read, rating, summary } = req.body;
    await updateReview(bookId, {date_read, rating, summary});
    return res.redirect("/");
};

export async function deleteBook(req, res) {
    const bookId = req.params.id;
    await deleteBookAndReview(bookId);
    return res.redirect("/");
}


