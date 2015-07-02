var Show = require('../models/Show')
var eztv = require('./eztv')
var providers = [eztv];
var async = require('async')
var Trakt = require('trakt-api');
var trakt = Trakt('7b7b93f7f00f8e4b488dcb3c5baa81e1619bb074',  { extended : 'full,images' });
//var TTL = 100 * 1000 * 60 * 10
var TTL = 1
var helpers = {

	// Source: http://stackoverflow.com/a/1714899/192024
	buildQuerystring: function(obj) {
		var str = []
		for(var p in obj)
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
		if(pattern == value) return true
		if(pattern == '*') return true

		pattern = this.preg_quote(pattern, '/')

		// Asterisks are translated into zero-or-more regular expression wildcards
		// to make it convenient to check if the strings starts with the given
		// pattern such as "library/*", making any string check convenient.
		var regex = new RegExp('^' + pattern.replace('\\*', '.*') + '$')

		return !!value.match(regex);
	},

	// Source: http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/comment-page-1/
	stringToCamel: function(str) {
		return str.replace(/(\-[a-z])/g, function($1){
			return $1.toUpperCase().replace('-','')
		})
	},


  extractShowInfo: function(show, callback) {

      var that = this;
			
      console.log("extractShowInfo " + show.show + " " + show.imdb_id);
			console.log(show);
      var thisShow = {};
      var thisEpisodes = [];
      var thisEpisode = {};
      var numSeasons = 0;
	//console.log(show);
      var imdb = show.force ? show.slug : show.imdb_id;

      eztv.getAllEpisodes(show, function(err, data) {
          thisShow = data;
	  //console.log(data);
          if(!data) return callback(null, show);
          console.log("Looking for "+ show.show);

          var dateBased = data.dateBased;
          delete data.dateBased;

          numSeasons = Object.keys(data).length; //Subtract dateBased key

          // upate with right torrent link
          if(!dateBased) {
            async.each(Object.keys(data), function(season, cb) {
              try {
								console.log(season);
                trakt.season(show.slug , season, function(err, seasonData) {
                  for(var episodeData in seasonData){
                    episodeData = seasonData[episodeData];
                    if (typeof(data[season]) != 'undefined' && typeof(data[season][episodeData.number]) != 'undefined') {
                    // hardcode the 720 for this source
                    // TODO: Should add it from eztv_x
                    thisEpisode = {
                      tvdb_id: episodeData.ids.tvdb,
                      season: episodeData.season,
                      episode: episodeData.number,
                      title: episodeData.title,
                      overview: episodeData.overview,
                      date_based: false,
                      first_aired: new Date(episodeData.first_aired_utc).getTime(),
                      watched : {watched: false},
                      torrents: []
                    };
                    thisEpisode.torrents = data[season][episodeData.number];
                    thisEpisode.torrents[0] = data[season][episodeData.number]["480p"] ? data[season][episodeData.number]["480p"] : data[season][episodeData.number]["720p"]; // Prevents breaking the app
                    thisEpisodes.push(thisEpisode);
                  }
                }
                cb();
              });
              } catch (err) {
                console.log("Error:", err)
                return cb();
              }
            },
            function(err, res) {
             // Only change "lastUpdated" date if there are new episodes
             Show.find({imdb_id: imdb}, function(err, show) {
                 if(err) return callback(err, null);
                 if(show.episodes != thisEpisodes) {
                     Show.update({ imdb_id: imdb },
                         { $set: { episodes: thisEpisodes, last_updated: +new Date(), num_seasons: numSeasons}},
                         function(err, show) {
                             return callback(err, null);
                         });
                 }
                 else {
                     return callback(null, show);
                 }
             });

         });
        }
        else {

            try {
              trakt.episode(imdb,season,episode , function(err, show) {

                if(!show) return callback(null, show);
                else {
									
                  var seasons = show.seasons;
                  async.each(seasons, function(season, cbs) {
                    var episodes = season.episodes;
                    async.each(episodes, function(episode, cbe){
                      var aired = new Date(episodeData.first_aired_utc).getTime();
                      if(aired){
                        var year_aired = aired.substring(0, aired.indexOf("-"));
                        var date_aired = aired.substring(aired.indexOf("-") + 1, aired.indexOf("T")).replace("-", "/");
                        if(typeof(data[year_aired]) != 'undefined' && typeof(data[year_aired][date_aired]) != 'undefined')
                        {
                          thisEpisode = {
                            tvdb_id: episode.ids.tvdb,
                            season: episode.season,
                            episode: episode.number,
                            title: episode.title,
                            overview: episode.overview,
                            first_aired: new Date(episodeData.first_aired_utc).getTime(),
                            date_based: true,
                            year: year_aired,
                            day_aired: date_aired,
                            watched : {watched: false},
                            torrents: []
                          };
                          thisEpisode.torrents = data[year_aired][date_aired];
                          thisEpisode.torrents[0] = data[year_aired][date_aired]["480p"] ? data[year_aired][date_aired]["480p"] : data[year_aired][date_aired]["720p"]; // Prevents breaking the app
                          thisEpisodes.push(thisEpisode);
                        }
                      }
                      return cbe();
                    },
                    function(err, res) {return cbs()})
                  }, function(err, res) {
                 // Only change "lastUpdated" date if there are new episodes
                 Show.find({imdb_id: imdb}, function(err, show) {
                     if(err)  return callback(err, null);
                     if(show.episodes != thisEpisodes) {
                         Show.update({ imdb_id: imdb },
                             { $set: { episodes: thisEpisodes, last_updated: +new Date(), num_seasons: numSeasons}},
                             function(err, show) {
                                 return callback(err, null);
                             });
                     }
                     else {
                         return callback(null, show);
                     }
                 });

                });
              }
            });

          } catch (err) {
                  console.log("Error:", err);
                  return callback(err, null);
          }

        }

      });
  },


	refreshDatabase: function () {
      var allShows = [];
      var that = this;
      async.each(providers, function(provider, cb) {
          provider.getAllShows(function(err, shows) {
              if(err) return console.error(err);
              allShows.push(shows);
              cb();
          });
      }, function (error) {
          if(error) return console.error(error);

          // 2 process?
          async.mapLimit(allShows[0], 2, helpers.extractTrakt, function(err, results){

            console.log("Update complete");

          });

      });
  	},

  	extractTrakt: function (show, callback) {
      var that = this;
      var slug = show.slug;
        try {
        //console.log(show);
	console.log("Extracting "+ show.show);
        Show.findOne({slug: slug}, function(err, doc){
	
            if(err || !doc) {
                console.log("New Show");
                try {
                    trakt.show(slug, function(err, data) {
                    if (!err && data) {
			//console.log(data);
                        // ok show exist
		//console.log(data);
	if ( data.ids.imdb === null ) {
    data.ids.imdb = data.ids.tvdb;
}
if ( data.ids.imdb.length === 0 ) {
 data.ids.imdb = data.ids.tvdb;
}

			if (data.genres.length === 0) {
    data.genres = ['All'];
} else {
    var index;
    for (index = 0; index < data.genres.length; ++index) {
            data.genres[index] = data.genres[index].replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
}
				
if ( data.images.poster.full === null ) {
data.images.poster.full = 'images/posterholder.png';
}
if ( data.images.fanart.full === null ) {
data.images.fanart.full = 'images/posterholder.png';
}
if ( data.images.banner.full === null ) {
data.images.banner.full = 'images/posterholder.png';
}
                        var newShow =  new Show ({
                            _id: data.ids.imdb,
                            imdb_id: data.ids.imdb,
                            tvdb_id: data.ids.tvdb,
                            title: data.title,
                            year: data.year,
														images: { poster: data.images.poster.full,
                                    fanart: data.images.fanart.full,
                                    banner: data.images.fanart.full },
                            slug: slug,
                            synopsis: data.overview,
                            runtime: data.runtime,
														rating: { percentage: data.rating*10,
                                    votes: data.rating,
																		loved: '0',
																		hated: '0',
                                    },
                            genres: data.genres,
                            country: data.country,
                            network: data.network,
                            air_day: data.air_day,
                            air_time: data.air_time,
                            status: data.status,
                            num_seasons: 0,
                            last_updated: 0
                        });

                        newShow.save(function(err, newDocs) {
                            show.imdb_id = data.imdb_id;
                            helpers.extractShowInfo(show, function(err, show) {
                                return callback(err, show);
                            });
                        });
                    }
                    else {
                        return callback(null, show);
                    }
                })
            } catch (err) {
                console.log("Error:", err)
                return callback(null, show);
            }
        }
        else {
            console.log("Existing Show: Checking TTL");
            // compare with current time
            var now = +new Date();
            if ( (now - doc.last_updated) > TTL ) {
                console.log("TTL expired, updating info");
                show.imdb_id = doc.imdb_id;
                //TODO: Change this to just get new rating or something
                try {
                  trakt.show(slug, function(err, data) {
                      if (!err && data) {
                        Show.update({ _id: doc._id },
                             { $set: { rating: { percentage: data.rating*10,
                                    votes: data.rating,
																		loved: '0',
																		hated: '0',
                                    }, status: data.status}},
                             function(err, doc1) {
                              helpers.extractShowInfo(show, function(err, show) {
                                return callback(err, show);
                              });
                            });
                      }
                  });
                } catch (err) {
                    console.log("Error:", err)
                    return callback(err, null);
                }
            }
            else {
                return callback(null, show);
            }
        }
      });

    } catch (err) {
      console.log("Error:", err)
      return callback(err, null);
    }

  },


}

module.exports = helpers;

