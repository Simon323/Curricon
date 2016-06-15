var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
	console.log('Open DB connection');
});

mongoose.connect('mongodb://localhost:27017/mongo');

var movieSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String
});

var Contact = mongoose.model('concatlist', movieSchema);


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get('/concatlist', function(req, res){
	console.log("GET: concatlist");

	Contact.find({}, function (err, docs) {
		console.log(docs);
        res.json(docs);
    });
});

app.post('/contactlist', function(req, res){
	console.log(req.body);
	var contact = new Contact({
		name: req.body.name,
		email: req.body.email,
		number: req.body.number
	});

	contact.save(function (err, contact) {
		if (err) return console.error(err);

		res.send("200 OK");
	})
});

app.delete('/contactlist/:id', function (req, res) {
	var id = req.params.id;
	console.log(id);
	Contact.remove({ _id: id }, function (err) {
		if(err) throw err;

		res.send("200 OK");
	});
});

app.get('/contactlist/:id', function (req, res) {
	var id = req.params.id;
	Contact.findOne({ _id: id}, function (err, docs) {
		res.json(docs);
	})
});

app.put('/contactlist/:id', function (req, res) {
	var id = req.params.id;

	Contact.findOne({ _id: id }, function (err, doc){
		doc.name = req.body.name;
		doc.email = req.body.email;
		doc.number = req.body.number;
		doc.save();

		res.json(doc);
	});
});

app.listen(3000);
console.log("server is runing");