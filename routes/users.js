// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');
const {check, validationResult } = require("express-validator")

//Config
const saltRounds = 10;


// Helpers
const redirectLogin = (req, res, next) => {
    if(!req.session.userId) {
        res.redirect("./login")
    } else {
        next();
    }
}


// Routers
router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered',
    [check("email").isEmail(),
    check("first", "last").isAlphanumeric(),
    check().notEmpty(),
    check("password").isLength({ min: 8 }),
    check('username').isLength({ min: 5, max: 20 }),],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("./register")
        } else {
            bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
                if (err) return res.send(err);

                let sqlQuery = `
            INSERT INTO userdata (username, firstName, lastName, email, hashedPassword) 
            VALUES (?, ?, ?, ?, ?)
        `
                let newRecord = [
                    req.body.username,
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashedPassword
                ];

                db.query(sqlQuery, newRecord, (err, result) => {
                    if (err) return res.send(err)
                    res.send(`Hello ${req.body.first} ${req.body.last} you are now registered!
                    We will send an email to you at ${req.body.email}. Your password is:
                    ${req.body.password} and your hashed password is: ${hashedPassword}
                `)
                });
            })
        };
    });

router.get("/login", (req, res, next) => {
    res.render("login.ejs")
})

router.post("/loggedin", (req, res, next) => {
    db.query("SELECT hashedPassword FROM userdata WHERE username = ?", req.body.username, (err, result) => {
        if(err) return next(err)
        if(!result[0]) return res.send("User not found")

        bcrypt.compare(req.body.password, result[0].hashedPassword, (err, equal) => {
            if (err) return next(err)
            // ID is stored instead of username, to reduce redudancy
            let query = `
                INSERT INTO login_attempts (userId, outcome, time) 
                SELECT id, ?, NOW()
                FROM userdata WHERE username = ?;
            `

            // We don't want this function to throw any errors if they fail, nor do we want them to hold up log in.
            // Therefore we just let it run and allow the webapp to continue with log in
            let outcome = equal ? "Success" : "Failure"
            db.query(query, [outcome, req.body.username], (err, result) => { return })
            if (equal) {
                req.session.userId = req.body.username;
                res.send("Login successful")
            } else {
                res.send("Login unsuccesful")
            }
        })
    })
})

router.get("/logout", redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect("../")
    });
    res.send('you are now logged out. <a href='+'../'+'>Home</a>')
})


router.get("/audit", redirectLogin, (req, res, next) => {
    // As I want to display username, not userID, I have to grab the username from userdata using its id 
    const query = `
    SELECT userdata.username, login_attempts.outcome, login_attempts.time 
    FROM login_attempts INNER JOIN userdata 
    ON login_attempts.userId=userdata.id
    `
    
    db.query(query, (err, result) => {
        if (err) return next(err)
        res.render("audit.ejs", { attempts: result })
    });
})

router.get("/list", redirectLogin, (req, res, next) => {
    let sqlquery = 
    db.query("SELECT username, firstName, lastName, email FROM userdata", (err, result) => {
        if (err) return next(err)
        res.render("listUsers.ejs", { users: result })
    });
})

// Export the router object so index.js can access it
module.exports = router
