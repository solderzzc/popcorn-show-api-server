var Show = require('../models/Show')
var eztvapi_provider = require('./eztvapi_provider')
var providers = [eztvapi_provider];
var async = require('async')
var config = require('../config')
var URI = require('URIjs')

var TTL = config.scrapeTtl;

var helpers = {

	// resize image
	resizeImage: function(imageUrl, width) {
		var uri = URI(imageUrl),
			ext = uri.suffix(),
			file = uri.filename().split('.' + ext)[0];

		// Don't resize images that don't come from trakt
		//  eg. YTS Movie Covers
		if (uri.domain() !== 'trakt.us') {
			return imageUrl;
		}

		var existingIndex = 0;
		if ((existingIndex = file.search('-\\d\\d\\d$')) !== -1) {
			file = file.slice(0, existingIndex);
		}

		if (file === 'poster-dark') {
			return 'images/posterholder.png'.toString();
		} else {
			return uri.filename(file + '-' + width + '.' + ext).toString();
		}
	},

	// Source: http://stackoverflow.com/a/1714899/192024
	buildQuerystring: function(obj) {
		var str = []
		for (var p in obj)
			if (obj.hasOwnProperty(p))
				str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
		return str.join('&')
	},

	// Source: http://phpjs.org/functions/preg_quote/
	preg_quote: function(str, delimiter) {
		return String(str)
			.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
	},

	// Determine if a given string matches a given pattern.
	// Inspired by PHP from Laravel 4.1
	str_is: function(pattern, value) {
		if (pattern == value) return true
		if (pattern == '*') return true

		pattern = this.preg_quote(pattern, '/')

		// Asterisks are translated into zero-or-more regular expression wildcards
		// to make it convenient to check if the strings starts with the given
		// pattern such as "library/*", making any string check convenient.
		var regex = new RegExp('^' + pattern.replace('\\*', '.*') + '$')

		return !!value.match(regex);
	},

	// Source: http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/comment-page-1/
	stringToCamel: function(str) {
		return str.replace(/(\-[a-z])/g, function($1) {
			return $1.toUpperCase().replace('-', '')
		})
	},

	refreshDatabase: function() {
		var allShows = [];
		async.each(providers, function(provider, cb) {
			provider.getAllShows(function(err, shows) {
				if (err) return console.error(err);
				allShows.push(shows);
				cb();
			});
		}, function(error) {
			// 2 process?
			async.mapLimit(allShows[0], 1, helpers.extractAllInformation, function(err, results) {
				console.log("Update complete");
				config.lastRefresh = new Date;
			});
		});
	},

	extractAllInformation: function(show, callback) {
		try {
			console.log("Extracting " + show.show);
			Show.findOne({
                imdb_id: show.imdb_id
			}, function(err, doc) {
				if (err || !doc) {
					console.log("New Show");
					try {
                        eztvapi_provider.extractAllInformation(show, function(err, data) {
							if (!err && data) {
								// make sure trakt returned something valid
								if (!data.imdb_id) {
                                    console.log('Not found');
									return callback(null, show);
								}

								data.images.lowres = helpers.resizeImage(data.images.poster, 300);
								data.images.fanart = helpers.resizeImage(data.images.fanart, 940);

								// ok show exist
								var newShow = new Show({
									_id: data.imdb_id,
									imdb_id: data.imdb_id,
									tvdb_id: data.tvdb_id,
									title: data.title,
									year: data.year,
									images: data.images,
									slug: data.slug,
									synopsis: data.overview,
									runtime: data.runtime,
									rating: data.rating,
									genres: data.genres,
									country: data.country,
									network: data.network,
									air_day: data.air_day,
									air_time: data.air_time,
									status: data.status,
                                    episodes: data.episodes,
                                    last_updated: +new Date(),
									num_seasons: data.num_seasons
								});

                                console.log('saved show ' + JSON.stringify(newShow));

								newShow.save(function(err, newDocs) {
                                    return callback(err, show);
								});
							} else {
								return callback(null, show);
							}
						})
					} catch (err) {
						console.error("Error:", err)
						return callback(null, show);
					}
				} else {
					console.log("Existing Show: Checking TTL");
					// compare with current time
					var now = +new Date();
					if ((now - doc.last_updated) > TTL) {
						console.log("TTL expired, updating info");
						show.imdb_id = doc.imdb_id;
						//TODO: Change this to just get new rating or something
						try {
                            eztvapi_provider.extractAllInformation(show, function(err, data) {
								if (!err && data) {
                                    if (doc.episodes != data.episodes)
                                    {
                                        Show.update({
                                                _id: doc._id
                                            }, {
                                                $set: {
                                                    rating: data.rating,
                                                    status: data.status,
                                                    episodes: data.episodes,
                                                    last_updated: +new Date(),
                                                    num_seasons: data.numSeasons
                                                }
                                            },
                                            function(err, doc1) {
                                                return callback(err, show);
                                            });
                                    } else {
                                        Show.update({
                                                _id: doc._id
                                            }, {
                                                $set: {
                                                    rating: data.rating,
                                                    status: data.status,
                                                    last_updated: +new Date()
                                                }
                                            },
                                            function(err, doc1) {
                                                return callback(err, show);
                                            });
                                    }
								}
							});
						} catch (err) {
							console.error("Error:", err)
							return callback(err, null);
						}
					} else {
						return callback(null, show);
					}
				}
			});

		} catch (err) {
			console.error("Error:", err)
			return callback(err, null);
		}

	}
}

module.exports = helpers;
