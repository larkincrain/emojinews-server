 // app/routes.js

// grab the nerd model we just created
var Word        = require('./word');
var Article     = require('./article');    

var fs          = require('fs');
var bcrypt      = require('bcrypt-nodejs');
var jwt         = require('jsonwebtoken');
var _           = require('lodash');

module.exports = function(app) {

    // WORDS
    // Insert a word singly
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
                    message: 'Word already exists',
                    words: words
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

    // get information on a word
    app.get('/api/words/:word', function(req, res) {
        Word.find({
            word: req.params.word
        }, function(err, words){

            if (err) {
                return res.json({ message: 'No words exists for this word'});
            }

            res.json(words);
        });
    });

    // ARTICLES
    // create a new word
    app.post('/api/articles', function(req, res) {
        
        console.log('got a request! Source: ' + req.body.source + ', headline: ' + req.body.headline);

        // create a new article
        var newArticle = Article({
          source: req.body.source,
          headline: req.body.headline,
          date: req.body.date
        });

        // we need to make sure that we don't already have this article
        // signed up with this email address
        Article.find({
            source: req.body.source,
            headline: req.body.headline,
        }, function (err, articles) {
            if (err) 
                res.json({
                    success: false,
                    message: err
                });

            if (articles.length > 0) {
                res.json({
                    success: false,
                    message: 'Article already exists',
                    articles: articles
                });
            }
            else {

                // save the article
                newArticle.save(function(err) {
                    if (err) {
                        return res.json({ 
                            success: false, 
                            message: 'error saving article: ' + err
                        });
                    } 

                    // now let's look them up!
                    Article.findOne({ 
                        source: req.body.source,
                        headline: req.body.headline
                        },
                        function(err, article){
                            if (err){
                                res.json({ 
                                    message: 'Error occured: ' + err,
                                    success: false
                                });
                            }

                            if (!article) {
                                res.json({ 
                                    message: 'Article doesnt exist',
                                    success: false
                                }); 
                            } else {

                                res.json({ 
                                    success: true, 
                                    message: 'article created successfully!',
                                    article: article
                                });
                            }
                        });
                });
            } 
        });
    });

    // get an article
    app.get('/api/articles/:source/:headline', function(req, res) {
        Article.find({
            source: req.params.source,
            headline: req.params.headline
        }, function(err, articles){

            if (err) {
                return res.json({ message: 'Article not found!'});
            }

            res.json(articles);
        });
    });

    //EMOJIS
    // add an emoji to an article
    app.post('/api/emojis', function(req, res) {
        // find the article that is passed in
        console.log('got a request! Source: ' + req.body.source + ', headline: ' + req.body.headline);

        // we need to make sure that we don't already have this article
        // signed up with this email address
        Article.find({
            source: req.body.source,
            headline: req.body.headline,
        }, function (err, articles) {
            if (err) 
                res.json({
                    success: false,
                    message: err
                });

            if (articles.length == 1) {
                // then we have the article we need to add the emoji to
                var article = articles[0];

                // see if there is an instance of this emoji in the article already
                var emojiIndex = _.findIndex(
                    article.emojis, 
                    { 'emoji': req.body.emoji});

                // if the index is greater than -1, then we need to increment the count
                if (emojiIndex > -1)
                    article.emojis[emojiIndex].count ++;
                else {
                    article.emojis[article.emojis.length] = {
                        'emoji': req.body.emoji,
                        'count': 1
                    };
                }

                article.save(function(err) {
                    if (err) {
                        return res.json({ 
                            success: false, 
                            message: 'error saving emoji to article: ' + err
                        });
                    }
                    
                    res.json({ 
                        success: true, 
                        message: 'emoji saved to article successfully!',
                        article: article
                    });

                });
            }
        });
    });
};
