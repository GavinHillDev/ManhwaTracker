var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var TrackerSchema = new Schema(
    {
        title : {type: String, required: true},
        rank : {type: String},
        day : {type: String, required: true},
        // week: {type: String, required: true},
        name: {type: String, required: true},
        // user: [{type: Schema.Types.ObjectId, ref: 'User'}],
    }
)


  module.exports = mongoose.model('Tracker', TrackerSchema);