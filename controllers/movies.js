var analytics = require('../lib/analytics');
var Rating = require('../models/Rating');
var Movie = require('../models/Movie');
var config = require('../config.js');
var request = require('request');

var genreKeywords = function(keywords) {
    return (function(keywords) {
        var string = '';
        keywords.forEach(function(keyword) {
            string += '(?=.*' + keyword + '.*)';
        });
        return string;
    }(keywords.split('% '))).replace(/(е|ё)/i, '(е|ё)');
};

var templateRecord = function(info) {
    return {
        "id":info.id,
        "url":info.url,
        "imdb_code":info.imdb_code,
        "title":info.title,
        "title_long":info.title_long,
        "slug":info.slug,
        "year":info.year,
        "rating":info.rating,
        "runtime":info.runtime,
        "genres":info.genres,
        "language":info.language,
        "mpa_rating":info.mpa_rating,
        "background_image":info.background_image,
        "small_cover_image":info.small_cover_image,
        "medium_cover_image":info.medium_cover_image,
        "state":info.state,
        "torrents":info.torrents,
        "date_uploaded":info.date_uploaded,
        "date_uploaded_unix":info.date_uploaded_unix
    };
};
module.exports = {
	getMovieRating: function(req, res) {
        Rating.findOne({_id: req.params.id}, {_id: 0, rt: 1}, function (err, doc) {
            if(err || !doc) {
                request('http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json', {
                        json: true,
                        qs: {
                            id: req.params.id.match(/tt([0-9]*)/)[1],
                            type: 'imdb',
                            apikey: '6psypq3q5u3wf9f2be38t5fd'
                        },
                        headers: {
                            'X-Originating-Ip': req.ip
                        }
                    },
                    function(err, response, body) {
                        var rating = new Rating;
                        rating._id = req.params.id;
                        rating.rt = body.ratings;
                        rating.save();

                        res.json({
                            rt: body.ratings
                        });
                    })
            } else {
                res.json(doc);
            }
        })
    },
    listMovies: function(req, res) {
        var params = req.query,
            limit = params.limit || 20,
            page = params.set || params.page ||1,
            genre = params.genre || 'all',
            keywords = params.keywords || false,
            filter = genre === 'all' ? {} : {
                'genre': new RegExp(genre, 'i')
            },
            sort = {};

        if (keywords) {
            keywords = new RegExp(keywords, 'i');
            filter.title = keywords;
        }

        if (params.sort) {
            switch (params.sort) {
                case 'year':
                    params.sort = 'year';
                    break;
                case 'alphabet':
                    params.sort = 'title';
                    break;
                case 'date':
                    params.sort = 'date';
                    break;
                default:
                    params.sort = 'date';
                    break;
            }
            if (params.sort) {
                sort[params.sort] = params.order === 'desc' ? -1 : 1;
            }
        }
        console.log('params are' + JSON.stringify(params));
        return Movie.find(filter, null, {
                skip: limit * (page - 1),
                limit: limit,
                sort: sort
            },
            function(error, items) {
                if (error) {
                    console.log('Error: ' + error);
                    return logger.error(error);
                }

                var list = [],
                    i = null;
                for (i = 0; i < items.length; i++) {
                    var item = items[i];
                    list.push(templateRecord(item));
                }
                console.log('Got ' + list.length + ' result ');
                return res.json({
                    "status": "ok",
                    "status_message": "Query was successful",
                    "data": {
                        "movie_count": 4340,
                        "limit": limit,
                        "page_number": page,
                        "movies": list
                    },
                    "@meta":{
                        "server_time":1438904472,
                        "server_timezone":"Pacific\/Auckland",
                        "api_version":2,
                        "execution_time":"3.24 ms"
                    }
                });
            });
    }
}
