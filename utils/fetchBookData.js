import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const book_search_api_url = process.env.BOOK_SEARCH_API;
const book_cover_api_url = process.env.BOOK_COVER_API;

if (!book_search_api_url || !book_cover_api_url) {
  throw new Error("Missing BOOK_SEARCH_API or BOOK_COVER_API env vars");
}

export default async function fetchBookData(title) {
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
       ? `${book_cover_api_url}/id/${coverId}-L.jpg` 
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