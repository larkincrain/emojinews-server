// app/models/user.js
// grab the mongoose module
var mongoose = require('mongoose');

// define our comment model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Article', {
    source: {type: String, default: ''},
    headline: {type : String, default: '' },
    date: {type: Date, default: Date.now},
    
    emojis: [
		{
			emoji: {type: String, default: ''},
			count: {type: Number, default: 0}
		}
	]
});