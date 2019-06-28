const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000

var MongoClient = require('mongodb').MongoClient

app.post('/createSession', (req, res) => {
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
  .then(client => {
	  
	  var sessionId = Math.random() * (99999 - 1000) + 1000;
	  sessionId=sessionId.toFixed()
	  var db = client.db("agileretro");
	  var myobj = { sessionId: sessionId};
	  db.collection("sessions").insertOne(myobj);
	  res.send({sessionId:sessionId});
  });
	
});

app.post('/saveComments', (req, res) => {
	req.body.likes = 0;
	req.body.dislikes = 0;
	console.log(req.body);
	MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
	.then(client => {
	  
	  var db = client.db("agileretro");
	  db.collection("comments").insertOne(req.body).then(response => res.status(200).json(response)).catch(error => console.error(error));
  });
  
});


app.post('/getComments', (req, res) => {
	console.log({"sessionId":req.body.sessionId});
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
  .then(client => {
    const db = client.db('agileretro');
    const collection = db.collection('comments');
	collection.find({"sessionId":req.body.sessionId}).toArray().then(response => res.status(200).json(response)).catch(error => console.error(error));
  });
});


app.post('/updateDislikes', (req, res) => {
	
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
  .then(client => {
    const db = client.db('agileretro');
    const collection = db.collection('comments');
	collection.update({"id":req.body.id},{$inc: {dislikes: 1}},{multi:true});
	res.send({"success":"DisLike Updated successfully"});
  });
});

app.post('/updateLikes', (req, res) => {
	
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
  .then(client => {
    const db = client.db('agileretro');
    const collection = db.collection('comments');
	collection.update({"id":req.body.id},{$inc: {likes: 1}},{multi:true});
	res.send({"success":"Like Updated successfully"});
  });
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))