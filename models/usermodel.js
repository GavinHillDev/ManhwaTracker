var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema (
    {
        username: {type: String, required: true, maxLength: 100, minLength: 3},
        password: {type: String, required: true},
    }
)
// UserSchema
// .virtual('url')
// .get(function () {
//     return '/inventory/genre/' + this._id;
//   });

module.exports = mongoose.model('User', UserSchema);
