const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;
const NotesSchema = Schema({
    notetext: {type: String, default: ''},
    user: {type: Schema.ObjectId, ref: 'User'},
    userprofile: {type: Schema.ObjectId, ref: 'Userprofile'}
});

NotesSchema.plugin(AutoIncrement, {id:'order_seq',inc_field: 'notesid'});

module.exports = mongoose.model('Notes', NotesSchema, 'notes');

