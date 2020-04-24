const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserprofileSchema = Schema({
    firstname: {type: String, default: ''},
    lastname: {type: String, default: ''},
    address: {type: String, default: ''},
    user: {type: Schema.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Userprofile', UserprofileSchema, 'userprofile');

