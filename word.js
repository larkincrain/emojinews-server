// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our comment model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Word', {
    type : {type : String, default: ''},
    word: {type : String, default: '' },
    polarity: {type: Number, default: 0}
});