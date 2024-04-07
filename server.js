const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');



const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017/';
const dbName = 'mydb';

app.use(cors());
app.use(bodyParser.json());

app.route('/api/oldUserData')
  .post((req, res) => {
  const dataFromlogin = req.body.data;
  console.log('Data received from frontend:', dataFromlogin);
  
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to the database');
    const db = client.db(dbName);

    db.collection('credentials') 
        .findOne({ "username": dataFromlogin["username"], "pwd": dataFromlogin["pwd"]})
        .then((existingUser) => {
          if (existingUser) {
            console.log("found!!")
            const filter = { "username": dataFromlogin["username"] }; // Filter criteria
            const updateDoc = { $set: { "in": 1 } }; // Update operation (set "age" to 35)
            db.collection('credentials').updateOne(filter, updateDoc);

            res.json({ value: 1, message: 'Welcome' });
            
          } else { 
            res.json({ value: 0, message: 'Wrong Username/Password' });
          }
          });
  });    
});

app.route('/api/newUserData')
  .post((req, res) => {
  const dataFromlogin = req.body.data;
  console.log('Data received from frontend:', dataFromlogin);
  
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to the database');
    const db = client.db(dbName);

    db.collection('credentials') 
        .findOne({ "username": dataFromlogin["username"], "pwd": dataFromlogin["pwd"]})
        .then((existingUser) => {
          if (existingUser) {
            console.log("found!!")
            res.json({ value: 1, message: 'You are an existing user' });
          } else { 
            res.json({ value: 0, message: 'Welcome to Terra' });
            const loginData = {
              username: dataFromlogin["username"],
              pwd : dataFromlogin["pwd"],
              in : 0
            };
            db.collection('credentials') 
            .insertOne(loginData)
            .then((result) => {
              console.log(`Document inserted with _id: ${result.insertedId}`);
              res.json({ value: 0, message: "new user created!" });
            })
            .catch((err) => {
              console.error('Error inserting document:', err);
            })
            .finally(() => {
              client.close(); 
            });
          }
          });
  });    
});

app.route('/api/logout')
  .post((req, res) => {
  const dataFromlogin = req.body.data;
  console.log('Data received from frontend:', dataFromlogin);
  
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to the database');
    const db = client.db(dbName);
    if (dataFromlogin["set"] ==0){

    db.collection('credentials').updateMany({}, {$set: {"in": 0}});
    }
});
  });

  app.route('/api/questrec')
  .post((req, res) => {
  const dataFromlogin = req.body.data;
  console.log('Data received from frontend:', dataFromlogin);
  
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to the database');
    const db = client.db(dbName);

   
    if (dataFromlogin["set"] == 0) {
      db.collection('credentials').findOne({ "in": 1 }).then(user => {
        if (user) {
          var usn = user.location; // Store user location in variable
          console.log(usn); // Log user location
          db.collection('quests').find({ "UserLocation": usn }).project({ "QuestTitle": 1 }).toArray().then(titles => res.send(JSON.stringify(titles)));
          // Further operations dependent on 'usn' should go here
        } else {
          console.log("No user found with 'in' set to 1.");
        }
      });
    }
    }, function(err) {
      console.error(err);
    })
  });




/*app.route('/api/newUserData')
  .post((req, res) => {
  const dataFromlogin = req.body.data;
  console.log('Data received from frontend:', dataFromlogin);
  
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to the database');
    const db = client.db(dbName);

    db.collection('credentials') 
        .findOne({ "username": dataFromlogin["username"]})
        .then((existingUser) => {
          if (existingUser) {
            res.json({ value: 1, message: 'Username already exists' });
          } else { 
            const loginData = {
              username: dataFromlogin["username"],
              pwd : dataFromlogin["pwd"]
            };
            db.collection('credentials') 
            .insertOne(loginData)
            .then((result) => {
              console.log(`Document inserted with _id: ${result.insertedId}`);
              res.json({ value: 0, message: "new user created!" });
            })
            .catch((err) => {
              console.error('Error inserting document:', err);
            })
            .finally(() => {
              client.close(); 
            });
          }
          });
  });    
});



app.route('/api/sendData')

  .post((req, res) => {
    const dataFromFrontend = req.body.data;
    console.log('Data received from frontend:', dataFromFrontend);

    var program = {
        script : dataFromFrontend["code"],
        language: dataFromFrontend["type"],
        versionIndex: "4",
        clientId: "722d6f1db7e0dedd0e7b7aa9ac02022b",
        clientSecret:"b62cac404190f5552d392a6c2e56ba1e3d2f9fffea2f6c2faed2e7e36a85a0f5"
    };

    request({
        url: 'https://api.jdoodle.com/v1/execute',
        method: "POST",
        json: program
    },
    function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body: ', body)
        res.json(body);
        
    })  
  });

 */

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

