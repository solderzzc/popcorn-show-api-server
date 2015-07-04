/*************************
**  Modules     **
**************************/

var request =   require('request');
var cheerio =   require('cheerio');
var moment  =   require('moment');
var _  =   require('lodash');
var fs = require('fs');
var file = __dirname + '/tv.json';



/*************************
**  Variables   **
**************************/

var BASE_URL    =   "http://eztv-proxy.net";
var SHOWLIST    =   "/showlist/";
var LATEST  =   "/sort/100/";
var SEARCH  =   "/search/";
var SHOWS   =   "/shows/";


exports.getAllShows =   function(cb) {
    if(cb === null) return;

    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        console.log('Error: ' + err);
        return;
      }
      var allShows = [];
      data = JSON.parse(data);
      //console.log(data);
      allShows = data;
        return cb(null, allShows);
        });
    };


exports.getAllEpisodes = function(data, cb) {
    if(cb === null) return;
    var episodes = {};
    var missings = [];

    var match_title = function (title) {
        var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/i); // s01e01
        if (matcher == null) {
            matcher = title.match(/(\d\d\d\d)/); // 0101
            if (matcher !== null) {
                matcher[2] = parseInt(matcher[1].substr(2,4));
                matcher[1] = parseInt(matcher[1].substr(0,2));
            } else {
                matcher = title.match(/(\d\d\d)/); // 101
                if (matcher !== null) {
                    matcher[2] = parseInt(matcher[1].substr(1,2));
                    matcher[1] = parseInt(matcher[1].substr(0,1));
                }
            }
        }
        return matcher;
    };

    if (data.id != null) {



        console.log(BASE_URL + SHOWS + data.id + "/"+ data.slug +"/");
        request.get(BASE_URL + SHOWS + data.id + "/"+ data.slug +"/", function (err, res, html) {

            if (!err) {

                var $ = cheerio.load(html);
                var show_rows = $('tr.forum_header_border[name="hover"]').filter(function() {
                    episode_rows = $(this).children('.forum_thread_post');
                    if(episode_rows.length > 0) {
                        var title = $(this).children('td').eq(1).text();
                        return true;
                    }
                    return false;
                });

                if(show_rows.length === 0) return cb("Show Not Found", null);

                show_rows.each(function() {
                    var entry = $(this);
                    var title = entry.children('td').eq(1).text().replace('x264', ''); // temp fix
                    //var magnet = entry.children('td').eq(2).children('a').first().attr('href');
                    var allLinks = entry.children('td').eq(2).children('a');
                    var magnet = false;
                    allLinks.each(function( index ) {
                        var thisUrl = $( this ).attr('href');
                        if (!magnet) {
                            if (thisUrl.match(/magnet/i) !== null) {
                                console.log("Magnet found in index " + index);
                                magnet = thisUrl;
                            }
                        }
                    });
                    var matcher = match_title(title);
                    var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";
                    if(matcher && magnet && magnet.match(/magnet/i) !== null) {
                        var season = parseInt(matcher[1], 10);
                        var episode = parseInt(matcher[2], 10);
                        var torrent = {};
                        torrent.url = magnet;
                        torrent.seeds = 0;
                        torrent.peers = 0;
                        if(!episodes[season]) episodes[season] = {};
                        if(!episodes[season][episode]) episodes[season][episode] = {};
                        if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1 || title.toLowerCase().indexOf("xvid") > -1 )
                        episodes[season][episode][quality] = torrent;
                        episodes.dateBased = false;
                        var missing = false;
                        if (missing = _.find(missings, { 'season': season, 'episode': episode })) {
                            missings = _.without(missings, missing);
                        }

                    }
                    else {
                        matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                        var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";
                        if(matcher && magnet && magnet.match(/magnet/i) !== null) {

                        } else {
                            var matcher = match_title(title);
                            if (matcher) {
                                var season = parseInt(matcher[1], 10);
                                var episode = parseInt(matcher[2], 10);
                                if(!episodes[season] || !episodes[season][episode]) {
                                    missings.push({'season': season, 'episode': episode});
                                    console.log('maybe missing magnet : S'+season+'E'+episode );
                                }
                            }
                        }
                    }
                });
            }
            // extract from strike
     // extract from KAT
        var Q = require('q');
        var KAT_INIT = function () {
            var defer = Q.defer();
            console.log("KAT init");
            require('kat-api').search({
                query: data.show,
                category: 'TV',
                sort_by: 'seeders',
                min_seeds: '10',
                order: 'desc'
            }).then(function(response) {
                var totalpage = response.total_pages;
                console.log("KAT init: %s results in %s pages", response.total_results, totalpage);
                var pagenumber = 1;

                var found = new Array();
                var CALL_KAT = function (pgnum) {

                    console.log("KAT paginated search, on page:", pgnum);
                    require('kat-api').search({
                        query: data.show,
                        category: 'TV',
                        sort_by: 'seeders',
                        min_seeds: '10',
			age: '24h',
                        order: 'desc',
                        page: pgnum
                    }).then(function (response) {
                        response.results.forEach(function (torrent) {
                            var title = torrent.title.replace('x264', '');;
                            var magnet = torrent.magnet;
                            var matcher = match_title(title);
                            var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";

                            var eztv = title.match(/eztv/g);
                            var ettv = title.match(/ettv/g);
                            var rartv = title.match(/rartv/g);
                            var SNEAkY = title.match(/SNEAkY7/g);
                            var rarbg = title.match(/AgentEncore/g);
                            var abjex = title.match(/abjex/g);

                            var xvid = title.match(/xvid/i);


                            if (!xvid && (rartv || ettv || eztv || SNEAkY || rarbg || abjex)) {
                                console.log('KAT valid torrent found');

                                if (matcher) {
                                    var season = parseInt(matcher[1], 10);
                                    var episode = parseInt(matcher[2], 10);
                                    var torrent = {};

                                    // we confirm its a missing file
                                    if (missing = _.find(missings, { 'season': season, 'episode': episode }) && found.indexOf('s'+season+'e'+episode) === -1) {
                                        console.log('MISSING S'+season+'E'+episode+' completed by KAT');
                                        found.push('s'+season+'e'+episode);
                                        missing = _.without(missings, missing);
                                        torrent.url = magnet;
                                        torrent.seeds = torrent.seeds;
                                        torrent.peers = torrent.leechs;
                                        if(!episodes[season]) episodes[season] = {};
                                        if(!episodes[season][episode]) episodes[season][episode] = {};
                                        if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1 || title.toLowerCase().indexOf("xvid") > -1 )
                                        episodes[season][episode][quality] = torrent;
                                        episodes.dateBased = false;
                                    } else {
                                        console.log('We found S'+season+'E'+episode+' but its not missing');
                                    }
                                }
                                else {
                                    matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                                    var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";
                                    if(matcher) {

                                    }
                                }
                            }
                        });

                        // next
                        pagenumber++;
                        if (pgnum == totalpage) {
                            defer.resolve(true);
                        } else {
                            CALL_KAT(pagenumber);
                            return;
                        }
                    }).catch(function (e) {
                        console.log('CALL KAT error', e);
                        defer.resolve(true);
                    });
                }

                CALL_KAT(pagenumber);

            }).catch(function (e) {
                console.log('KAT INIT error', e);
                defer.resolve(true);
            });
            return defer.promise;
        }

        KAT_INIT().then(function (finished) {
            console.log('finished');
        });

            // https://getstrike.net/api/v2/torrents/search/?phrase=#slug
            //var strikeUrl = "https://getstrike.net/api/v2/torrents/search/?category=TV&key=f9cE6zj7s7svvhPY22mgmh2182X814Im&phrase=" + data.show.replace(',','').replace(' ','+');
            var strikeUrl = "https://getstrike.net/api/v2/torrents/search/?category=TV&key=f9cE6zj7s7svvhPY22mgmh2182X814Im&phrase=" + data.show.replace(',','').replace(' ','+');
            console.log("Strike request: " + strikeUrl);
            request.get(strikeUrl, function (err, res, json) {
            
		json = JSON.parse(json);

                if (!json.statuscode || json.statuscode !== 200 || err) {
                    console.log('Strike error: ', json.statuscode);
                    return cb(null, episodes);
                } else {

                    json.torrents.forEach(function(torrent) {

                      var title = torrent.torrent_title.replace('x264', '');;
                      var magnet = torrent.magnet_uri;
                      var uploader = torrent.uploader_username;
                      var matcher = match_title(title);
                      var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";

                      var eztv = uploader.match(/eztv/i);
                      var ettv = uploader.match(/ettv/i);
                      var rartv = title.match(/rartv/i);
                      var SNEAkY = uploader.match(/SNEAkY7/i);
                      var rarbg = uploader.match(/AgentEncore/i);
                      var abjex = uploader.match(/abjex/i);
              
                     var xvid = title.match(/xvid/i);


                  if (!xvid && (rartv || ettv || eztv || SNEAkY || rarbg || abjex)) {
                            console.log('Strike valid torrent found');

                            if(matcher) {
                                var season = parseInt(matcher[1], 10);
                                var episode = parseInt(matcher[2], 10);
                                var torrent = {};

                                // we confirm its a missing file
                                if (missing = _.find(missings, { 'season': season, 'episode': episode })) {
                                    console.log('MISSING S'+season+'E'+episode+' completed by strike');
                                    missing = _.without(missings, missing);
                                    torrent.url = magnet;
                                    torrent.seeds = 0;
                                    torrent.peers = 0;
                                    if(!episodes[season]) episodes[season] = {};
                                    if(!episodes[season][episode]) episodes[season][episode] = {};
                                    if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1 || title.toLowerCase().indexOf("xvid") > -1 )
                                    episodes[season][episode][quality] = torrent;
                                    episodes.dateBased = false;
                                } else {
                                    console.log('We found S'+season+'E'+episode+' but its not missing');
                                }
                            }
                            else {
                                matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                                var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";
                                if(matcher) {

                                }
                            }
                        }
                    });

                    return cb(null, episodes);
                }



            });


        });

    } else {
    // extract from KAT
var Q = require('q');
var KAT_INIT = function () {
    var defer = Q.defer();
    console.log("KAT init");
    require('kat-api').search({
        query: data.show,
        category: 'TV',
        sort_by: 'seeders',
        min_seeds: '10',
	age: '24h',
        order: 'desc'
    }).then(function(response) {
        var totalpage = response.total_pages;
        console.log("KAT init: %s results in %s pages", response.total_results, totalpage);
        var pagenumber = 1;

        var found = new Array();
        var CALL_KAT = function (pgnum) {

            console.log("KAT paginated search, on page:", pgnum);
            require('kat-api').search({
                query: data.show,
                category: 'TV',
                sort_by: 'seeders',
                min_seeds: '10',
		age: '24h',
                order: 'desc',
                page: pgnum
            }).then(function (response) {
                response.results.forEach(function (torrent) {
                    var title = torrent.title.replace('x264', '');;
                    var magnet = torrent.magnet;
                    var matcher = match_title(title);
                    var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";

                    var eztv = title.match(/eztv/g);
                    var ettv = title.match(/ettv/g);
                    var rartv = title.match(/rartv/g);
                    var SNEAkY = title.match(/SNEAkY7/g);
                    var rarbg = title.match(/AgentEncore/g);
                    var abjex = title.match(/abjex/g);

                    var xvid = title.match(/xvid/i);


                    if (!xvid && (rartv || ettv || eztv || SNEAkY || rarbg || abjex)) {
                        console.log('KAT valid torrent found');

                        if (matcher) {
                            var season = parseInt(matcher[1], 10);
                            var episode = parseInt(matcher[2], 10);
                            var torrent = {};

                            // we confirm its a missing file
                            if (missing = _.find(missings, { 'season': season, 'episode': episode }) && found.indexOf('s'+season+'e'+episode) === -1) {
                                console.log('MISSING S'+season+'E'+episode+' completed by KAT');
                                found.push('s'+season+'e'+episode);
                                missing = _.without(missings, missing);
                                torrent.url = magnet;
                                torrent.seeds = torrent.seeds;
                                torrent.peers = torrent.leechs;
                                if(!episodes[season]) episodes[season] = {};
                                if(!episodes[season][episode]) episodes[season][episode] = {};
                                if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1 || title.toLowerCase().indexOf("xvid") > -1 )
                                episodes[season][episode][quality] = torrent;
                                episodes.dateBased = false;
                            } else {
                                console.log('We found S'+season+'E'+episode+' but its not missing');
                            }
                        }
                        else {
                            matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                            var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";
                            if(matcher) {

                            }
                        }
                    }
                });

                // next
                pagenumber++;
                if (pgnum == totalpage) {
                    defer.resolve(true);
                } else {
                    CALL_KAT(pagenumber);
                    return;
                }
            }).catch(function (e) {
                console.log('CALL KAT error', e);
                defer.resolve(true);
            });
        }

        CALL_KAT(pagenumber);

    }).catch(function (e) {
        console.log('KAT INIT error', e);
        defer.resolve(true);
    });
    return defer.promise;
}

KAT_INIT().then(function (finished) {
    console.log('finished');
});
        // extract from strike
        // https://getstrike.net/api/v2/torrents/search/?phrase=#slug
        var strikeUrl = "https://getstrike.net/api/v2/torrents/search/?category=TV&key=f9cE6zj7s7svvhPY22mgmh2182X814Im&phrase=" + data.show.replace(',','').replace(' ','+');
        console.log("Strike request: " + strikeUrl);
        request.get(strikeUrl, function (err, res, json) {

            json = JSON.parse(json);

            if (!json.statuscode || json.statuscode !== 200 || err) {
                console.log('Strike error: ', json.statuscode);
                return cb(null, episodes);
            } else {

                json.torrents.forEach(function(torrent) {

                  var title = torrent.torrent_title.replace('x264', '');  // temp fix
                  var magnet = torrent.magnet_uri;
                  var uploader = torrent.uploader_username;
                  var matcher = match_title(title);
                  var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";

                  var eztv = uploader.match(/eztv/i);
                  var ettv = uploader.match(/ettv/i);
                  var rartv = title.match(/rartv/i);
                  var SNEAkY = uploader.match(/SNEAkY7/i);
                  var rarbg = uploader.match(/AgentEncore/i);
                  var abjex = uploader.match(/abjex/i);
                  var xvid = title.match(/xvid/i);


                  if (!xvid && (rartv || ettv || eztv || SNEAkY || rarbg || abjex)) {

                        console.log('Strike valid torrent found');

                        if(matcher) {
                            var season = parseInt(matcher[1], 10);
                            var episode = parseInt(matcher[2], 10);
                            var torrent = {};
                            torrent.url = magnet;
                            torrent.seeds = 0;
                            torrent.peers = 0;
                            if(!episodes[season]) episodes[season] = {};
                            if(!episodes[season][episode]) episodes[season][episode] = {};
                            if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1 || title.toLowerCase().indexOf("xvid") > -1 )
                            episodes[season][episode][quality] = torrent;
                            episodes.dateBased = false;
                        }
                        else {
                            matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                            var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";
                            if(matcher) {
                                var season = matcher[1]; // Season : 2014
                                var episode = matcher[2].replace(" ", "/"); //Episode : 04/06
                                var torrent = {};
                                torrent.url = magnet;
                                torrent.seeds = 0;
                                torrent.peers = 0;
                                if(!episodes[season]) episodes[season] = {};
                                if(!episodes[season][episode]) episodes[season][episode] = {};
                                if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1)
                                episodes[season][episode][quality] = torrent;
                                episodes.dateBased = true;
                            }
                        }
                    }
                });
                return cb(null, episodes);
            }



        });
    }


};
