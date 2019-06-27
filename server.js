const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000
const data = {
	"wentWell": [{
			"id": 123,
			"title": "All Stories completed on Time",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 223,
			"title": "Team Collaboration was good between QA and DEV in this Sprint",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 224,
			"title": "Proper UT has been done from Dev Side which lead to 0 defect in  QA",
			"upCount": 0,
			"downCount": 0
		}
	],
	"toImprove": [{
			"id": 780,
			"title": "Proper analysis need to be done before Sprint Planning.",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 7987,
			"title": "Correct Estimation of Stories need to be given.",
			"upCount": 0,
			"downCount": 0
		}, {
			"id": 797,
			"title": "Environment Issue need to be fix.",
			"upCount": 0,
			"downCount": 0
		}
	],
	"actions": [{
			"id": 798987,
			"title": "Allocation of Environment.",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 798989,
			"title": "Time need to be given for Analaysis",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 798990,
			"title": "Allocation of task should be given as per interest and expertise",
			"upCount": 0,
			"downCount": 0
		}
	],
	"bestContributer": [{
			"id": 798327,
			"title": "Vaibhav",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 79817,
			"title": "Mohit",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 798427,
			"title": "Gaurav",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 798328,
			"title": "Vaqass",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 798330,
			"title": "Preeti",
			"upCount": 0,
			"downCount": 0
		},
		{
			"id": 798331,
			"title": "Asif",
			"upCount": 0,
			"downCount": 0
		}

	]
}

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

app.post('/updateLikes', (req, res) => {
	
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true })
  .then(client => {
    const db = client.db('agileretro');
    const collection = db.collection('comments');
	collection.find({"sessionId":req.body.sessionId}).toArray().then(response => res.status(200).json(response)).catch(error => console.error(error));
	collection.update({"sessionId":req.body.sessionId,"id":req.body.id},{$inc: {likes: 1}},{multi:true});
  });
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`))