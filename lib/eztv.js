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
    if (data.id) {



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
                    var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/);
                    var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
                    if(matcher && magnet && magnet.match(/magnet/i) !== null) {
                        var season = parseInt(matcher[1], 10);
                        var episode = parseInt(matcher[2], 10);
                        var torrent = {};
                        torrent.url = magnet;
                        torrent.seeds = 0;
                        torrent.peers = 0;
                        if(!episodes[season]) episodes[season] = {};
                        if(!episodes[season][episode]) episodes[season][episode] = {};
                        if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1)
                        episodes[season][episode][quality] = torrent;
                        episodes.dateBased = false;
                        var missing = false;
                        if (missing = _.find(missings, { 'season': season, 'episode': episode })) {
                            missings = _.without(missings, missing);
                        }

                    }
                    else {
                        matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                        var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
                        if(matcher && magnet && magnet.match(/magnet/i) !== null) {

                        } else {
                            var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/);
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

                      var title = torrent.torrent_title.replace('x264', '');   // temp fix
                      var magnet = torrent.magnet_uri;
                      var uploader = torrent.uploader_username;
                      var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/);
                      var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";

                      var eztv = uploader.match(/eztv/g);
                      var ettv = uploader.match(/ettv/g);
                      var rartv = uploader.match(/rartv/g);
                      var SNEAkY = uploader.match(/SNEAkY7/g);
                      var rarbg = uploader.match(/rarbg/g);
                      var abjex = uploader.match(/abjex/g);
                      if (rartv || ettv || eztv || SNEAkY || rarbg || abjex) {

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
                                    if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1)
                                    episodes[season][episode][quality] = torrent;
                                    episodes.dateBased = false;
                                } else {
                                    console.log('We found S'+season+'E'+episode+' but its not missing');
                                }
                            }
                            else {
                                matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                                var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
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

                  var title = torrent.torrent_title.replace('x264', '');   // temp fix
                  var magnet = torrent.magnet_uri;
                  var uploader = torrent.uploader_username;
                  var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/);
                  var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";

                  var eztv = uploader.match(/eztv/g);
                  var ettv = uploader.match(/ettv/g);
                  var rartv = uploader.match(/rartv/g);
                  var SNEAkY = uploader.match(/SNEAkY7/g);
                  var rarbg = uploader.match(/rarbg/g);
                  var abjex = uploader.match(/abjex/g);
                  if (rartv || ettv || eztv || SNEAkY || rarbg || abjex) {

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
                            if(!episodes[season][episode][quality] || title.toLowerCase().indexOf("repack") > -1)
                            episodes[season][episode][quality] = torrent;
                            episodes.dateBased = false;
                        }
                        else {
                            matcher = title.match(/(\d{4}) (\d{2} \d{2})/); // Date based TV Shows
                            var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
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

