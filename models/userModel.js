import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect();

// authentication route functions
export async function findUserByUserName(username) {
  // console.log(user)
  const result = await db.query("SELECT * FROM users WHERE email=($1)", [
    username,
  ]);
  return result.rows[0];
}

export async function createUser(username, password) {
  const hashedPassword = bcrypt.hash(password, 9, async (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      throw err;
    } else {
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2)",
        [username, hash]
      );
      console.log("User created successfully");
      return result.rows[0];
    }
  });
}

export async function findUserById(id) {
  const result = await db.query("SELECT * FROM users WHERE id=$1", [id]);
  return result.rows[0];
}
