# Personal Book Tracker

A full-stack web application that helps you track and manage your personal reading journey. Keep records of books you've read, write reviews, and maintain a personal library with book covers and ratings.

## Core Features

**Book Management**
- Add new books to your reading list
- Automatic book cover fetching from Open Library API
- Edit existing book reviews and ratings
- Delete books from your collection

**Review System**
- Rate books on a scale of 1 to 10
- Write detailed summaries and reviews
- Track reading dates
- View your reading history in chronological order

**User Interface**
- Clean, responsive web interface
- Book cover display
- Easy navigation between adding, editing, and viewing books
- Modern EJS templating for dynamic content

## Tech Stack

**Backend**
- **Node.js**: Runtime environment for server-side JavaScript
- **Express.js**: Web framework for building the RESTful API and handling routes
- **PostgreSQL**: Relational database for storing book and review data
- **pg**: PostgreSQL client for Node.js database interactions

**Frontend**
- **EJS**: Templating engine for dynamic HTML generation
- **CSS**: Custom styling for responsive design
- **JavaScript**: Client-side interactivity

**External APIs**
- **Open Library Search API**: For fetching book metadata
- **Open Library Cover API**: For retrieving book cover images

**Additional Tools**
- **Axios**: HTTP client for making API requests
- **body-parser**: Middleware for parsing request bodies
- **dotenv**: Environment variable management

## Database Schema

The application uses two main tables with a one-to-many relationship:

**Books Table**
- `id`: Primary key (auto-increment)
- `book_title`: Title of the book (required)
- `author`: Author name (required)
- `cover_url`: URL to book cover image
- `amazon_url`: Link to Amazon listing (optional)

**Review Table**
- `id`: Primary key (auto-increment)
- `book_id`: Foreign key referencing books table
- `date_read`: Date when the book was finished
- `rating`: Numerical rating between 1 and 10
- `summary`: Personal review or summary text
- `created_at`: Timestamp of review creation

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js (version 14 or higher)
- PostgreSQL database server
- npm or yarn package manager

## Installation and Setup

**1. Clone the Repository**
```bash
git clone <repository-url>
cd book-tracker-v2
```

**2. Install Dependencies**
```bash
npm install
```

**3. Database Setup**
Create a PostgreSQL database and run the provided SQL schema:

```sql
-- Create the database
CREATE DATABASE book_tracker;

-- Use the queries.sql file to create tables
\i querries.sql
```

**4. Environment Configuration**
Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DB_USER=your_postgres_username
DB_HOST=localhost
DB_DATABASE=book_tracker
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# API Configuration
BOOK_SEARCH_API=https://openlibrary.org/search.json
BOOK_COVER_API=https://covers.openlibrary.org/b
```

**5. Start the Application**
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage Guide

**Adding a New Book**
1. Navigate to the "Add New Book" page
2. Enter the book title (the system will automatically fetch author and cover)
3. Fill in your reading date, rating, and review
4. Submit to add the book to your collection

**Viewing Your Library**
- The home page displays all your books in chronological order (most recent first)
- Each book shows the cover, title, author, rating, and review summary

**Editing a Review**
1. Click the edit button on any book card
2. Modify the reading date, rating, or summary
3. Save changes to update your review

**Removing a Book**
- Click the delete button to permanently remove a book and its review from your collection

## API Endpoints

**GET /** - Display all books and reviews (home page)

**GET /new** - Show the add new book form

**POST /add** - Add a new book and review to the database

**GET /edit/:id** - Display edit form for a specific book

**POST /edit/:id** - Update an existing book review

**GET /delete/:id** - Delete a book and its associated review

## Project Structure

```
book-tracker-v2/
├── app.js              # Main application file (newer version)
├── index.js            # Alternative entry point (legacy)
├── package.json        # Project dependencies and scripts
├── querries.sql        # Database schema definitions
├── config/
│   └── db.js          # Database connection configuration
├── routes/
│   └── books.js       # Route handlers for book operations
├── views/
│   ├── index.ejs      # Home page template
│   ├── new.ejs        # Add book form template
│   └── edit.ejs       # Edit book form template
├── public/            # Static assets (CSS, images, client-side JS)
├── controllers/       # Business logic controllers
├── models/           # Data models and database schemas
├── middleware/       # Custom middleware functions
└── utils/           # Utility functions and helpers
```

## Contributing

When contributing to this project:

1. Follow the existing code style and structure
2. Test all database operations thoroughly
3. Ensure proper error handling for API calls
4. Update documentation for any new features
5. Validate all user inputs on both client and server side

## Troubleshooting

**Database Connection Issues**
- Verify PostgreSQL is running
- Check your `.env` file credentials
- Ensure the database and tables exist

**API Integration Problems**
- Confirm internet connectivity for Open Library API calls
- Check API rate limits if requests are failing
- Verify the book title format when searching

**Book Not Found**
- The system handles cases where books aren't found in the Open Library
- You can manually enter book details if automatic fetching fails

This application provides a solid foundation for personal book tracking while remaining simple to use and extend with additional features.