var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var WednesdayTrackerSchema = new Schema(
    {
        title : {type: String, required: true},
        rank : {type: String},
        day : {type: String, required: true},
        name: {type: String, required: true},
        // user: [{type: Schema.Types.ObjectId, ref: 'User'}],
    }
)


  module.exports = mongoose.model('WednesdayTracker', WednesdayTrackerSchema);