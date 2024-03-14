CREATE TABLE Passwords (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO Passwords (username, password) VALUES ('user1', 'password1');
INSERT INTO Passwords (username, password) VALUES ('user2', 'password2');