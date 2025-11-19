// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');

// Encryption config
const saltRounds = 10;

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password;
    let hash;
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
        if (err) {
            res.send(err)
        }
        else {
            hash = hashedPassword
            let sqlQuery = "INSERT INTO userData (username, firstName, lastName, email, hashedPassword) VALUES (?, ?, ?, ?, ?)"
            let newRecord = [req.body.username, req.body.first, req.body.last, req.body.email, hash];
            db.query(sqlQuery, newRecord, (err, result) => {
                if (err) {
                    res.send(err)
                }
                else {
                res.send(`Hello ${req.body.first} ${req.body.last} you are now registered!
                     We will send an email to you at ${req.body.email}. Your password is:
                     ${req.body.password} and your hashed password is: ${hash}
                    `)};                                                                              
            });
        }
    });
});

router.get("/list", (req, res, next) => {
    let sqlquery = "SELECT username, firstName, lastName, email FROM userdata"
    db.query(sqlquery, (err, result) => {
        if(err) {
            next(err)
        }
        res.render("listUsers.ejs", {users:result})
    });
})

// Export the router object so index.js can access it
module.exports = router
