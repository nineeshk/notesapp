const notes = require('../models/notes');
const user = require('../models/user');
const userprofile = require('../models/userprofile');
const router = require('express').Router();
const path = require('path');

// List all notes
router.get('/all', function (req, res) {
    
   notes
   .find()
   .populate('user', 'email')    
   .populate('userprofile', 'firstname lastname address')
   .select('notesid notetext -_id')
   .exec(function (err, todos) {
      if (err) {
         res.send(err);
      }
      res.json(todos);
   });
});

// Create a new note
router.post('/create', function (req, res, next){

   if (req.body.notetext.length < 4) {
      res.json({'Message':'Note text must contain minimum 4 characters.'});
      return;
   }
   
   var notesArr = {
      user: req.headers.userdata,
      userprofile: req.headers.userprofile,
      notetext: req.body.notetext
  }
  // Add note to notes collection
  notes.create(notesArr, function (err, notesData) {
      if (err)
         res.json({'Error' : 'Failed to create note'});
      res.json({"message": "Note created"});
  });
});

// Update note
router.post('/update', function (req, res, next){
   if (req.body.id != "") {
      var notesArr = { 
         notetext : req.body.notetext,
         user: req.headers.userdata,
         userprofile: req.headers.userprofile
      }
      notes.updateOne({notesid: req.body.id}, notesArr, {upsert: true},function (err, ret) {
         if (err)
            res.send(err);
         res.json({"message": "Note updated"});
     });
   }
});

// Delete note
router.delete('/delete/:id', function(req, res){
   notes.deleteOne({
      notesid: req.params.id
   }, function (err, todo) {
         if (err) res.send(err);
         if (todo.n === 1)
            res.json({"Message": "Note deleted"});
         else
            res.json({"Message": "No note found."});
   });
});

module.exports = router;