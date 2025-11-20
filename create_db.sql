# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS userdata (
    id              INT AUTO_INCREMENT,
    username        VARCHAR(50),
    firstName       VARCHAR(50),
    lastName        VARCHAR(50),
    email           VARCHAR(50),
    hashedPassword  TINYTEXT, 
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS login_attempts(
    id          INT AUTO_INCREMENT,
    userId      INT,
    outcome     VARCHAR(50),
    time        datetime,
    PRIMARY KEY(ID)
);

CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
 