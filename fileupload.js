var express = require("express");
var multer = require('multer');
var upload = multer({ dest: 'uploads/'});
var fs = require("fs");
var app = express();
// File input field name is simply 'file'

app.get('/', function(req, res){
    res.sendFile(__dirname + "/fileupload.html");
});

app.post('/file_upload', upload.single('imageupload'), function(req, res) {
  var file = __dirname + '/' + req.file.filename;
  fs.rename(req.file.path, file, function(err) {
    if (err) {
      console.log(err);
      res.send(500);
    } else {
      res.json({
        message: 'File uploaded successfully',
        filename: req.file.filename
      });
    }
  });
});

app.listen(8000, function(req, res){
    console.log("Listening at port 3000");
});