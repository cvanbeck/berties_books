# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

Then initalise database, this means running SQL scripts and adding DB password to .env

## dotenv
Password is stored in a .env file, when this application first runs it grabs this value and stores it
as a enviroment variable. When the DB runs it grabs this variable and uses it to log into the DB.

In order for it to work on the linux machine I ran the command `echo "PASSWORD=db_password" >> .env` to create the file

## Audit
This webapp also logs all login attempts made to a valid username, this is done by by creating a new table called login_attempts, when a login attempt is made it uses the username inputed to find the matching userId in userdata table. This is then stored alongside current time and if they managed to log in succesfully.

Then when making the query for login-attempts we use INNER JOIN combined with userId to find the correct username, this allows us to easily link login attempts to a user.

I didn't want this logging to hold up any other parts of the web app, the log in logging requests are one line callbacks that just return when complete, therefore users trying to log in aren't held back by the actual logging.

## Access Control
Authorisation has been required for access to the following pages: 
- Audit
- Logout
- List users
- Add new books

Users that aren't logged in are still able to access:
- Login
- Register
- About
- Search Books
- List all books
- List all books less than 20 pound