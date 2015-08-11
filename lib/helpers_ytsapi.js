var Movie = require('../models/Movie')
var ytsapi_provider = require('./ytsapi_provider')
var providers = [ytsapi_provider];
var async = require('async')
var config = require('../config')

var TTL = config.scrapeTtl;

var helpers_ytsapi = {
	refreshDatabase: function() {
		var allMovies = [];
		async.each(providers, function(provider, cb) {
			provider.getAllMovies(function(err, movies) {
				if (err) return console.error(err);
				movies.forEach(function (movie) {
					allMovies.push(movie);
				});
				cb();
			});
		}, function(error) {
			// 2 process?
			async.mapLimit(allMovies, 1, helpers_ytsapi.extractAllInformation, function(err, results) {
				console.log("Update complete");
				config.lastRefresh = +new Date();
			});
		});
	},

	extractAllInformation: function(movie, callback) {
		try {
			console.log("Extracting " + movie.title + ' id ' + typeof(movie.id));
			Movie.findOne({
                id: movie.id
			}, function(err, doc) {
				if (err || !doc) {
					console.log("New Show");
					try {
						// ok show exist
						movie['last_updated'] = +new Date()
						var newMovie = new Movie(movie);
						console.log('saved show ' + JSON.stringify(newMovie));

						newMovie.save(function(err, newDocs) {
							return callback(err, movie);
						});
					} catch (err) {
						console.error("Error:", err)
						return callback(null, movie);
					}
				} else {
					console.log("Existing Show: Checking TTL");
					// compare with current time
					var now = +new Date();
					if ((now - doc.last_updated) > TTL) {
						console.log("TTL expired, updating info");
						try {
							if (doc.torrents != movie.torrents)
							{
								Movie.update({
									_id: doc._id
								}, {
									$set: {
										rating: movie.rating,
										status: movie.status,
										torrents: movie.torrents,
										last_updated: +new Date(),
										mpa_rating:movie.mpa_rating,
										download_count:movie.download_count
									}
								},
								function(err, doc1) {
									return callback(null, movie);
								});
							} else {
								Movie.update({
										_id: doc._id
									}, {
										$set: {
											rating: movie.rating,
											status: movie.status,
											last_updated: +new Date(),
											mpa_rating:movie.mpa_rating,
											download_count:movie.download_count
										}
									},
									function(err, doc1) {
										return callback(null, movie);
									});
							}
						} catch (err) {
							console.error("Error:", err)
							return callback(null, movie);
						}
					} else {
						return callback(null, movie);
					}
				}
			});

		} catch (err) {
			console.error("Error:", err)
			return callback(err, null);
		}

	}
}

module.exports = helpers_ytsapi;
