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

/* GET messages from all users from database. */
router.get('/chat', function(req, res, next) {
    console.log("GET all chat messages route.");
    Chat.find(function(err,messageList) {
      if (err) return console.error(err);
      else {
        console.log(messageList);
        res.json(messageList);
      }
    })
});

/* POST find messages from a specific user from database and send them back. */
router.post('/userchat', function(req, res, next) {
    console.log("POST find an user messages and return them route.");
    var name = req.body.Name;
    console.log("Name: ", name);
    var findString = {Name: name };
    console.log("Find String: ", findString);
    Chat.find(findString,function(err,messageList) {
      if (err) return console.error(err);
      else {
        console.log(messageList);
        res.json(messageList);
      }
    })
});

/* DELETE an specific message. */
router.delete('/deletemessage', function(req, res, next) {
    console.log("DELETE an specific message route.");
    var name = req.body.Name;
    var message = req.body.Message;
    var removeString = {Name: name, Name: message };
    Chat.find().remove(removeString, function(err){
        if(err) console.log("Unable to delete user comment. Error: ", err); 
        else res.sendStatus(200); 
    });
});

/* DELETE all messages. */
router.delete('/deleteall', function(req, res, next) {
    console.log("DELETE all comments route.");
    console.log(req.body);
    Chat.find().remove(function(err){
        if(err) return console.error(err);
        else res.sendStatus(200);
    });
});

/* Set module exports to router */
module.exports = router;
