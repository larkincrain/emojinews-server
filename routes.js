 // app/routes.js

// grab the nerd model we just created
var Word        = require('./word');
var fs          = require('fs');
var bcrypt      = require('bcrypt-nodejs');
var jwt         = require('jsonwebtoken');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes
    app.post('/api/words', function(req, res) {
        
        // create a new user
        var newWord = Word({
          type: req.body.type,
          word: req.body.word,
          polarity: req.body.polarity
        });

        // we need to make sure that we don't already have a user 
        // signed up with this email address
        Word.find({
            word: req.body.word
        }, function (err, words) {
            if (err) 
                res.json({
                    success: false,
                    message: err
                });

            if (words.length > 0) {
                res.json({
                    success: false,
                    message: 'Word already exists'
                });
            }
            else {

                // save the word
                newWord.save(function(err) {
                    if (err) {
                        return res.json({ 
                            success: false, 
                            message: 'error saving word: ' + err
                        });
                    } 

                    // now let's look them up!
                    Word.findOne(
                        { word: req.body.word},
                        function(err, word){
                            if (err){
                                res.json({ 
                                    message: 'Error occured: ' + err,
                                    success: false
                                });
                            }

                            if (!word) {
                                res.json({ 
                                    message: 'Word doesnt exist',
                                    success: false
                                }); 
                            } else {

                                res.json({ 
                                    success: true, 
                                    message: 'word created successfully!',
                                    word: word
                                });
                            }
                        });
                });
            } 
        });
    });



};
