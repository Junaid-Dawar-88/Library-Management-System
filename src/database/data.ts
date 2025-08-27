import Database from "better-sqlite3";

const db = new Database("myDatabase.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS bookTable(
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     title TEXT NOT NULL,
     authorId INTEGER NOT NULL,
     publishedYear TEXT NOT NULL,
     available TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS author (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     country TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS member (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     email TEXT NOT NULL,
     joinDate TEXT NOT NULL
    );
   CREATE TABLE IF NOT EXISTS borrowBook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookId INTEGER NOT NULL,
    memberId INTEGER NOT NULL,
    borrowDate TEXT NOT NULL,
    returnDate TEXT,
    FOREIGN KEY (bookId) REFERENCES bookTable(id),
    FOREIGN KEY (memberId) REFERENCES member(id)
);

`);

export default db;
