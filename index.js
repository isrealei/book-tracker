import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv"
dotenv.config();


const app = express();
const port = 3000;
const book_search_api_url = process.env.BOOK_SEARCH_API;
const book_cover_api_url = process.env.BOOK_COVER_API;

// PostgreSQL client setup
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Function to fetch books
async function fetchBookData(title) {
  const url = `${book_search_api_url}?title=${encodeURIComponent(title)}&limit=1`
  try {
    const response = await axios.get(url);
    const book = response.data.docs[0];
    if (!book) {
        return {
            title,
            author: "Not known",
            coverUrl: null,
            msg: "Book could not be found"
        };
    };
    const coverId = book.cover_i;
    const coverUrl = coverId 
       ? `${book_cover_api_url}/${coverId}-L.jpg` 
       : null;
    return {
        title: book.title,
        author: book.author_name ? book.author_name[0] : "Author Unknown",
        coverUrl: coverUrl,
        msg: "Book is found"
    }
  } catch (err) {
    console.error("API Error:", err.message);
    return {
        title,
        author: "Null", 
        coverUrl: null,
        msg: `There was an api error`
    }
  }
};

// Routes

app.get("/", async (req, res) => {
    // Get the details of all the books read
    const query = {
        text: `SELECT books.id, books.book_title, books.author, books.cover_url,
        review.date_read, review.rating, review.summary
        FROM books
        JOIN review ON books.id = review.book_id
        ORDER BY review.date_read DESC`
    };
    const data = await db.query(query)
    const books = data.rows;
    res.json({
        msg: "Welcome to personal book tracker app",
        books: books
    });
});


app.post("/add", async (req, res) => {
      // Check if body exists and is not empty
    if (!req.body) {
        return res.status(400).json({"error": "Request body cannot be empty"});
    }

    const { book_title, date_read, rating, summary } = req.body;
    // validate book title
    if (!book_title || book_title.trim() === "") {
        return res.json({"msg": "book title must not be left empty"})
    }
    
    // fetch data from API
    const bookData = await fetchBookData(book_title);
    
    // handle API response safely
    if (bookData.msg === "Book could not be found") {
       console.log("input the book tile and author manually")
         return res.redirect("/");
    }

    if (bookData.msg === "There was an api error") {
       console.log("There was an api errror when trying to get the book details")
       return res.redirect("/");
    }


    try {
          // Begin a transaction
        await db.query("BEGIN");
        // Step 1: insert into books and RETURN the new ID
        const query = {
        text: "INSERT INTO books (book_title, author, cover_url) VALUES ($1, $2, $3) RETURNING id",
        values: [bookData.title, bookData.author, bookData.coverUrl]
        };
        const insertBook = await db.query(query)
        const bookId = insertBook.rows[0].id 
        // Step 2: insert into readings with the new book ID
        const readingQuery = { 
            text: "INSERT INTO review (book_id, date_read, rating, summary) VALUES ($1, $2, $3, $4)",
            values: [bookId, date_read, rating, summary]
        };
        const insertReview = await db.query(readingQuery);
        // Commit the transaction
        await db.query("COMMIT");
        console.log("Book and review added Successfully")
        res.redirect("/");
    }
    catch (error) {
        await db.query("ROLLBACK");
        console.error("Error adding book and review:", error);
        res.json({
            msg: `Error adding book and review: ${error}`
        });
    }
})











app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});