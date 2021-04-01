const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const mysql = require('mysql')
const multer = require('multer')
const path = require('path')
//use express static folder
app.use(express.static("./public"))
// set view engine
app.set('view engine', 'ejs')
// body-parser middleware use
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended: true
}))
// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345",
    database: "nodeapp"
})
db.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})
//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')     // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
});
//! Routes start

//@type   GET
//$route  /
//@desc   route for Home page
//@access PUBLIC
app.get("/", (req, res) => {
    res.render('home');
})

//@type   POST
//$route  /post
//@desc   route for post data
//@access PUBLIC
app.post("/post", upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        console.log(req.file.filename)
        var imgsrc = 'http://127.0.0.1:3000/images/' + req.file.filename
        var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
        db.query(insertData, [imgsrc], (err, result) => {
            if (err) throw err
            console.log("file uploaded")
        })
    }
});

app.get("/updateproduct", function (req, res) {

    console.log("Connected! Update product now!");
  
    var q = url.parse(req.url, true).query;
    var txt = q.name;
    console.log(txt);
  
    var selectProduct = "SELECT * FROM users_file WHERE name = '" + txt + "'";
    con.query(selectProduct, function (err, result) {
      if (err) throw err;
      upobj = { updateproduct: result };
      res.render('updateproduct', upobj);
    });
  
  });
  
  app.post("/updateproduct", function (req, res) {
  
    console.log(req.body.productId);
  
    var sqlProduct = "UPDATE products SET name = '" + req.body.productName + "', price = '" + req.body.productPrice + "', description= '" + req.body.productDescription + "', image = '" + req.body.productImage + "' where id = " + req.body.productId;
    con.query(sqlProduct, function (err, result) {
      if (err) throw err;
      console.log("1 record updated");
    });
  
    res.write("Product data updated!");
    res.end();
  
  });
  

//create connection
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`))