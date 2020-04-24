const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UsertokenSchema = Schema({
    token: {type: String, default: ''},
    created: {type: Date, default: Date.now},
    expiry: {type: Date, default: oneMonthFromNow()},
    user: {type: Schema.ObjectId, ref: 'User'}
});

function oneMonthFromNow() {
    var d = new Date();
    var targetMonth = d.getMonth() + 1;
    d.setMonth(targetMonth);
    if(d.getMonth() !== targetMonth % 12) {
        d.setDate(0); // last day of previous month
    }
    return d;
}

module.exports = mongoose.model('Usertoken', UsertokenSchema, 'usertoken');

