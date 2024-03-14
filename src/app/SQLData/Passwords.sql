CREATE TABLE IF NOT EXISTS Passwords (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT
);
