const http = require('http');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  console.log('Request for ' + req.url + ' by method ' + req.method);

  if (req.method == 'GET') {
    var fileUrl;
    if (req.url == '/') 
      fileUrl = '/index.html';
    else 
      fileUrl = req.url;

    var filePath = path.resolve('.'+fileUrl);
    
    const fileExt = path.extname(filePath);
    if (fileExt == '.html' || fileExt == '.css' || fileExt == '.js') {
      fs.exists(filePath, (exists) => {
        if (!exists) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html');
          res.end('<html><body><h1>Error 404: ' + fileUrl + 
                      ' not found</h1></body></html>');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
      });
    }
    else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end('<html><body><h1>Error 404: ' + fileUrl + 
              ' not a HTML file</h1></body></html>');
    }
  }

  else if(req.method == 'POST'){
    if(req.url == '/register'){
      var form = new formidable.IncomingForm();
      var formValidator = require('./registerValidate.js');
      var assert = require('assert');

      form.parse(req, function(err, fields, files){
        
        formValidator.validateForm(fields, files, (results) =>{
          if(results.success == false){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(results));
          }
          else{
            var MongoClient = require('mongodb').MongoClient;

            var url = 'mongodb://vaibhav281128:QuantumRobot%4095@ds219318.mlab.com:19318/trussbot_assignment';
            
            MongoClient.connect(url , (err, dbo) => {

              assert.equal(err, null);

              const mongo_ops = require('./mongo_ops');
              var db = dbo.db('trussbot_assignment');
              
              db.collection('person', (err,collection) => {
                assert.equal(err,null);

                var queryPhone = { 'phone' : fields.phone};
                var queryEmail = { 'email' : fields.email};
                var docInsert  = { 'name'  : fields.name, 'phone': fields.phone, 
                                   'email' : fields.email, 'jobTitle': fields.jobTitle};
                  
                mongo_ops.findDocument(db,queryPhone,collection, (foundPhone) => {
                
                  if(foundPhone.length > 0){
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'text/html');
                  res.end('<p>Failed, Phone number already exists.</p>');
                  }
                  else{
                    mongo_ops.findDocument(db,queryEmail, collection, (foundEmail) => {
                      if(foundEmail.length > 0){
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/html');
                        res.end('<p>Failed, Email Id already exists.</p>');
                      }
                      else{
                        mongo_ops.insertDocument(db, docInsert, collection, (inserted) => {
                          res.statusCode = 200;
                          res.setHeader('Content-Type', 'text/html');
                          res.end('<p>Success</p>');
                        });
                      }
                    });
                  }
                });
              });
            });
          }
        });
      });   
    }
    else{
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<html><body><h1>Error 404: ' + fileUrl + 
                    ' not found</h1></body></html>');
    }
  }

  else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.end('<html><body><h1>Error 404: ' + req.method + 
              ' not supported</h1></body></html>');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});