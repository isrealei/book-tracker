CREATE TABLE books (
id SERIAL PRIMARY KEY,
book_title TEXT NOT NULL,
cover_url TEXT,
author TEXT NOT NULL,
amazon_url TEXT
);


CREATE TABLE review (
id SERIAL PRIMARY KEY,
book_id INT REFERENCES books(id) ON  DELETE CASCADE,
date_read DATE,
rating INT CHECK (rating BETWEEN 1 AND 10),
summary TEXT,
Created_at TIMESTAMP DEFAULT NOW()
)