import pg from "pg";

export function dbConnect() {
  const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  db.connect()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("DB connection error:", err));

  return db;
}
