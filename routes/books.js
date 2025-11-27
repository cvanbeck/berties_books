// Create a new router
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search_result', function (req, res, next) {
    //searching in the database
    let search = req.query.search_text;
    let sqlQuery = `SELECT * FROM books WHERE name LIKE '%?%';`
    console.log(sqlQuery)
    db.query(sqlQuery, search, (err, result) => {
        if (err) {
            console.log(err)
            next(err)
        }
        else {
            res.render("search_result.ejs", { availableBooks: result })
        }
    })
});

router.get('/list', (req, res, next) => {
    let sqlquery = "SELECT * FROM books"
    db.query(sqlquery, (err, result) => {
        if(err) {
            console.log(err)
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
    });
});

router.get("/bargainbooks", (req, res) => {
    let sqlQuery = "SELECT * FROM books WHERE price < 20.00"
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.log(err)
            next(err)
        }
        else {
            res.render("bargainbooks.ejs", { availableBooks: result })
        }
    })
})

router.get("/addbook", (req, res) => {
    res.render("addBook.ejs", {error:""})
})

router.post("/bookadded", (req, res, next) => {
    let sqlQuery = "INSERT INTO books (name, price) VALUES (?,?)"
    let newRecord = [req.body.name, req.body.price]
    db.query(sqlQuery, newRecord, (err, result) => {
        if(err){
            res.render("addBook.ejs", {error:"Failed"})
        }
        else{
            res.send(`This book has been added to the database, name: ${req.body.name}
                price: ${req.body.price}`)  
        }
    })
})
// Export the router object so index.js can access it
module.exports = router
