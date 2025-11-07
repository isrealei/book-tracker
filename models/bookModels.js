import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

export async function querryAllBooks() {
    const query = {
        text: `SELECT books.id, books.book_title, books.author, books.cover_url,
        review.date_read, review.rating, review.summary
        FROM books
        JOIN review ON books.id = review.book_id
        ORDER BY review.date_read DESC`
    };
    const data = await db.query(query);
    return data.rows;
};


export async function addBook(bookData, date_read, rating, summary) {
    try {
      await db.query("BEGIN");
      console.log(bookData)
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
            values: [
                bookId, 
                date_read ? date_read.toString().trim() : null,
                rating ? parseInt(rating) : null,
                summary ? summary.toString().trim() : null
            ]
        };
        const insertReview = await db.query(readingQuery);
        console.log("Book and review added Successfully");
        await db.query("COMMIT");
    } catch (err) {
       await db.query("ROLLBACK");
        throw err;
    };
};


export async function getBookById(bookId) {
    try {
        const query = {
            text: `SELECT books.id AS book_id, books.book_title, books.author, books.cover_url,
            review.date_read, review.rating, review.summary
            FROM books
            JOIN review ON books.id = review.book_id
            WHERE books.id=$1`,
            values: [bookId]
        };
        const data = await db.query(query);
        const book = data.rows[0];
        console.log(book);
        return book;   
    }
    catch (error) {
        console.error("Error fetching book for edit:", error);
    }
};


export async function updateReview(bookId, { date_read, rating, summary }) {
    try { 
        const getReview = {
            text: "SELECT * FROM review WHERE book_id=$1",
            values: [bookId]
        };
        const reviewData = await db.query(getReview);
        const data = reviewData.rows[0];
        const query = {
            text: "UPDATE review SET date_read=$1, rating=$2, summary=$3 WHERE book_id=$4",
            values: [
                date_read ? date_read.toString().trim() : data.date_read,
                rating ? parseInt(rating) : data.rating,
                summary ? summary.toString().trim() : data.summary,
                bookId
            ]
        };
        const updateReview = await db.query(query);
        console.log("Review updated Successfully");

    } catch (err) {
        console.error("Error updating review:", err);
        res.json({
            msg: `Error updating review: ${err}`
        });
    };
};

export async function deleteBookAndReview(bookId) {
    try {
        // Begin a transaction
        await db.query("BEGIN");
        // Step 1: delete from review
        const deleteReviewQuery = {
            text: "DELETE FROM review WHERE book_id=$1",
            values: [bookId]
        };
        await db.query(deleteReviewQuery);
        // Step 2: delete from books
        const deleteBookQuery = {
            text: "DELETE FROM books WHERE id=$1",
            values: [bookId]
        };
        await db.query(deleteBookQuery);
        // Commit the transaction
        await db.query("COMMIT");
        console.log("Book and review deleted Successfully");

    } catch (error) {
        await db.query("ROLLBACK");
        console.error("Error deleting book and review:", error);
        res.json({
            msg: `Error deleting book and review: ${error}`
        });
    };
}
