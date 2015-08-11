"use strict";

var request = require('request');
var async = require('async');
var baseUrl = 'http://yts.io/api/v2/';
var listMovieUrl = baseUrl + "list_movies.json";

var doRequest = function (url, options, callback) {
    request({url: url, qs: options}, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var json = JSON.parse(body);
            callback(null, json);
        } else {
            callback(err, null);
        }
    });
};
var _doRequest = function (therequest, callback) {
    console.log('emit new request ' + JSON.stringify(therequest));
    request(therequest, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var json = JSON.parse(body);
            callback(null, json);
        } else {
            callback(err, null);
        }
    });
};
exports.listMovies = function (options, callback) {
    doRequest(baseUrl + "list_movies.json", options, callback);
};
exports.listAllMovies = function (options, callback) {
    options['limit'] = 50;
    options['page'] = 1;
    doRequest(baseUrl + "list_movies.json", options, function (err, json) {
        if (!err && json) {
            if (json.data.movie_count > json.data.limit) {
                var requests = []
                console.log('JSON response ' + JSON.stringify(json));
                for (var i = 2; (i * 50) <= json.data.movie_count ; i++ ) {
                    requests.push({url: listMovieUrl, qs: {limit:50,page:i}});
                }
                if (json.data.movie_count % 50 > 0) {
                    requests.push({url: listMovieUrl, qs: {
                        limit:json.data.movie_count % 50,
                        page:Math.round((json.data.movie_count / 50) + 1)
                    }});
                }
                async.mapLimit(requests,3,_doRequest,function(err,results){
                    console.log('got result ' + err);
                    console.log('results length ' + results.length);
                    if (!err && results){
                        for (var j = 0; j < results.length; j++) {
                            for (var k = 0; k < results[j].data.movies.length; k++ ) {
                                console.log('pushing ' + ((j + 1) * 50 + k) );
                                json.data.movies.push(results[j].data.movies[k])
                            }
                        }
                        callback(null, json);
                    } else {
                        callback(json, null);
                    }
                });
            } else {
                callback(null, json);
            }
        } else {
            callback(err, null);
        }
    });
};

exports.movieDetails = function (options, callback) {
    doRequest(baseUrl + "movie_details.json", options, callback);
};

exports.movieSuggestions = function (options, callback) {
    doRequest(baseUrl + "movie_suggestions.json", options, callback);
};

exports.movieComments = function (options, callback) {
    doRequest(baseUrl + "movie_comments.json", options, callback);
};

exports.movieReviews = function (options, callback) {
    doRequest(baseUrl + "movie_reviews.json", options, callback);
};

exports.movieParentalGuides = function (options, callback) {
    doRequest(baseUrl + "movie_parental_guides.json", options, callback);
};

exports.listUpcoming = function (options, callback) {
    doRequest(baseUrl + "list_upcoming.json", options, callback);
};

// TODO add user API stuff
