var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'); 

/* Set up mongoose */
mongoose.connect('mongodb://localhost/commentDB',{ useNewUrlParser: true }); //Connects to a mongo database called "commentDB"

var chatSchema = mongoose.Schema({ //Defines the Schema for this database
    Name: String,
    Message: String
});

var Chat = mongoose.model('Chat', chatSchema);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected');
});


/* POST send message. */
router.post('/chat', function(req, res, next) {
    console.log("POST add message on chat route.");
    console.log(req.body);
    var newMessage = new Chat(req.body); 
    console.log(newMessage); 
    newMessage.save(function(err, post) { 
      if (err) return console.error(err);
      console.log("Save Worked. Post:", post);
      res.sendStatus(200);
    });
});

/* GET messages from all users if no user if given, else give just that user from database. */

router.get('/chat', function(req, res, next) {
    console.log("In the GET route");
    var name=req.query["n"];
    var obj;
    console.log("finding",name);
    if(name){
        obj={Name:name};
        console.log(obj);
    }
    Chat.find(obj,function(err,commentList) { //Calls the find() method on your database
        if (err) return console.error(err); //If there's an error, print it out
        else {
            res.json(commentList);
        }
    });
});

/* DELETE an specific message if a message is given as data. */
router.delete('/chat', function(req, res, next) {
    console.log("DELETE an specific message route.");
    var name = req.body.Name;
    var message = req.body.Message;
    var obj;
    if (name){
        obj={Name: name, Name: message }
    }
    Chat.find().remove(obj, function(err){
        if(err) console.log("Unable to delete user comment. Error: ", err); 
        else res.sendStatus(200); 
    });
});



/* Set module exports to router */
module.exports = router;
