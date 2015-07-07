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
var BASE_URL    =   "http://eztv.ch";
var SHOWLIST    =   "/showlist/";
var LATEST  =   "/sort/100/";
var SEARCH  =   "/search/";
var SHOWS   =   "/shows/";

/*************************
**  Variables   **
**************************/

var BASE_URL    =   "http://eztv-proxy.net";
var SHOWLIST    =   "/showlist/";
var LATEST  =   "/sort/100/";
var SEARCH  =   "/search/";
var SHOWS   =   "/shows/";

var eztv_map = [];
eztv_map['rush-us'] = 'rush-2014';
eztv_map['heroes'] = 'faulty020qweqwe';
eztv_map['10-things-i-hate-about-you'] = '10-things-i-hfaulty2';
eztv_map['10-oclock-live'] = '10-o-clock-livefaulty';
eztv_map['the-royals'] = 'the-royals-2015';
eztv_map['fresh-off-the-boat'] ='fresh-off-the-boat-2015';
eztv_map['the-odd-couple'] = 'the-odd-couple-2015';
eztv_map['poldark-2015'] = 'poldark-2015';
eztv_map['banana'] = 'banana-2015';
eztv_map['hindsight'] = 'hindsight-2015';
eztv_map['togetherness'] = 'togetherness-2015';
eztv_map['night-shift-the'] = 'the-night-shift';
eztv_map['intruders'] = 'intruders-2014';
eztv_map['lucas-bros-moving-company'] = 'lucas-bros-moving-co';
eztv_map['last-man-standing-us'] = 'last-man-standing-2011';
eztv_map['the-bletchley-circle'] ='faulty2';
eztv_map['empire'] = 'empire-2015';
eztv_map['the-tonight-show-starring-jimmy-fallon'] = 'the-tonight-show-starring-jimmy-fallon';
eztv_map['the-wil-wheaton-project'] = 'the-wil-wheaton-project';
eztv_map['web-therapy'] = 'web-therapy-2011';
eztv_map['schitts-creek'] = 'schitt-s-creek'
eztv_map['seth-meyers-late-night-with'] = 'late-night-with-seth-meyers';
eztv_map['the-voice'] = 'the-voice-2011';
eztv_map['franklin-and-bash'] = 'franklin-bash';
eztv_map['key-and-peele'] = 'key-peele';
eztv_map['mike-and-molly'] = 'mike-molly';
eztv_map['adventure-time'] = 'adventure-time-2010';
eztv_map['the-league'] = 'the-league-2009';
eztv_map['melissa-and-joey'] = 'melissa-joey';
eztv_map['lost'] = 'lost-2004';
eztv_map['american-idol'] = 'american-idol';
eztv_map['the-bridge-us'] = 'the-bridge-2013';
eztv_map['bobs-burgers'] = 'bob-s-burgers';
eztv_map['ascension'] = 'Ascension';
eztv_map['once-upon-a-time'] = 'once-upon-a-time-2011';
eztv_map['the-borgias'] = 'borgia';
eztv_map['survivor'] = 'survivor-2000';
eztv_map['da-vincis-demons'] = 'da-vinci-s-demons';
eztv_map['its-always-sunny-in-philadelphia'] = 'it-s-always-sunny-in-philadelphia';
eztv_map['teen-wolf'] = 'teen-wolf-2011';
eztv_map['the-amazing-race'] = 'the-amazing-race-2001';
eztv_map['the-librarians'] = 'the-librarians-2014';
eztv_map['wilfred-us'] = 'wilfred';
eztv_map['undercover-boss-us'] = 'undercover-boss-2010';
eztv_map['shameless-us'] = 'shameless-2011';
eztv_map['rizzoli-and-isles'] = 'rizzoli-isles';
//eztv_map['the-ricky-gervais-show'] = 'faulty';
//eztv_map['richard-hammonds-crash-course'] = 'faulty';
eztv_map['revolution-2012'] = 'revolution';
eztv_map['rake-us'] = 'rake-2014';
//eztv_map['the-politicians-husband'] = 'faulty';
//eztv_map['penn-and-teller-bullshit'] = 'faulty';
//eztv_map['parades-end'] = 'faulty';
//eztv_map['page-eight'] = 'faulty';
//eztv_map['oliver-stones-untold-history-of-the-united-states'] = 'faulty';
//eztv_map['nick-swardsons-pretend-time'] = 'faulty';
//eztv_map['tim-and-erics-bedtime-stories'] = 'faulty';
//eztv_map['mike-and-molly'] = 'faulty';
//eztv_map['melissa-and-joey'] = 'faulty';
eztv_map['masterchef-us'] = 'masterchef';
eztv_map['marvels-agents-of-shield'] = 'marvel-s-agents-of-s-h-i-e-l-d';
eztv_map['marvels-agent-carter'] = 'marvel-s-agent-carter';
eztv_map['life-on-mars-us'] = 'life-on-mars';
//eztv_map['the-life-and-times-of-tim'] = 'faulty';
//eztv_map['level-up'] = 'faulty';
//eztv_map['the-league'] = 'faulty';
eztv_map['law-and-order-uk'] = 'law-order-uk';
eztv_map['law-and-order-special-victims-unit'] = 'law-order-special-victims-unit';
eztv_map['law-and-order-los-angeles'] = 'law-order-los-angeles';
eztv_map['law-and-order-criminal-intent'] = 'law-order-criminal-intent';
eztv_map['law-and-order'] = 'law-order';
eztv_map['zero-hour-us'] = 'zero-hour-2013';
eztv_map['youre-the-worst'] = 'you-re-the-worst';
eztv_map['late-night-with-conan-obrien'] = 'faulty';
//eztv_map['wedding-band'] = 'faulty';
//eztv_map['watson-and-oliver'] = 'faulty';
//eztv_map['the-village'] = 'faulty';
eztv_map['last-resort'] = 'last-resort-2012';
eztv_map['who-do-you-think-you-are-us'] = 'who-do-you-think-you-are';
eztv_map['undateable-2014'] = 'undateable';
eztv_map['the-x-factor-us'] = 'the-x-factor-2011';
eztv_map['the-x-factor'] = 'the-x-factor-uk';
eztv_map['tosh0'] = 'tosh-0';
eztv_map['skins-us'] = 'skins-2011';
//eztv_map['sit-down-shut-up'] = 'faulty';
//eztv_map['king-and-maxwell'] = 'faulty';
//eztv_map['shit-my-dad-says'] = 'faulty';
//eztv_map['runs-house'] = 'faulty';
//eztv_map['ruby-and-the-rockits'] = 'faulty';
//eztv_map['rosemarys-baby'] = 'faulty';
eztv_map['the-killing-us'] = 'the-killing';
//eztv_map['key-and-peele'] = 'faulty';
//eztv_map['kath-and-kim'] = 'faulty';
//eztv_map['john-safrans-race-relations'] = 'faulty';
//eztv_map['jamie-private-school-girl'] = 'faulty';
eztv_map['james-mays-cars-of-the-people'] = 'faulty';
eztv_map['the-tomorrow-people-us'] = 'the-tomorrow-people-2013';
//eztv_map['its-always-sunny-in-philadelphia'] = 'faulty';
eztv_map['the-inbetweeners-us'] = 'the-inbetweeners';
//eztv_map['human-target-2010'] = 'faulty';
//eztv_map['how-to-live-with-your-parents'] = 'faulty';
eztv_map['house-of-cards-2013'] = 'house-of-cards';
//eztv_map['hit-and-miss'] = 'faulty';
eztv_map['mistresses-us'] = 'mistresses';
eztv_map['hells-kitchen-uk'] = 'hell-s-kitchen';
eztv_map['hells-kitchen-us'] = 'hell-s-kitchen-2005';
//eztv_map['harrys-law'] = 'faulty';
//eztv_map['harpers-island'] = 'faulty';
eztv_map['greys-anatomy'] = 'grey-s-anatomy';
//eztv_map['gordons-great-escape'] = 'faulty';
//eztv_map['gordon-ramsays-ultimate-cookery-course'] = 'faulty';
//eztv_map['getting-on-us'] = 'faulty';
eztv_map['free-agents-us'] = 'free-agents-2011';
//eztv_map['franklin-and-bash'] = 'faulty';
//eztv_map['the-forgotten'] = 'faulty';
eztv_map['the-firm'] = 'the-firm-2012';
//eztv_map['the-finder'] = 'faulty';
//eztv_map['fat-tony-and-co'] = 'faulty';
//eztv_map['emily-owens-md'] = 'faulty';
//eztv_map['eastbound-and-down'] = 'faulty';
//eztv_map['drunk-history'] = 'faulty';
//eztv_map['trial-and-retribution'] = 'faulty';
//eztv_map['dont-trust-the-b-in-apartment-23'] = 'faulty2';
//eztv_map['doll-and-em'] = 'faulty';
//eztv_map['the-devils-whore'] = 'faulty';
//eztv_map['detroit-187'] = 'faulty';
//eztv_map['dara-o-briains-science-club'] = 'faulty';
//eztv_map['da-vincis-demons'] = 'faulty';
//eztv_map['cops-lac'] = 'faulty';
//eztv_map['coma-2012'] = 'faulty';
eztv_map['chicago-pd'] = 'chicago-p-d';
//eztv_map['the-chasers-war-on-everything'] = 'faulty';
//eztv_map['charlies-angels-2011'] = 'faulty2';
//eztv_map['charlie-brookers-screenwipe'] = 'faulty3';
//eztv_map['charlie-brookers-weekly-wipe'] = 'faulty3';
eztv_map['castle-2009'] = 'castle';
//eztv_map['the-bridge-us'] = 'faulty2';
//eztv_map['breathless-uk'] = 'faulty2';
//eztv_map['bostons-finest'] = 'faulty2';
//eztv_map['bobs-burgers'] = 'faulty2';
//eztv_map['the-black-box'] = 'faulty';
//eztv_map['big-brothers-big-mouth'] = 'faulty2';
//eztv_map['betty-whites-off-their-rockers'] = 'faulty2';
//eztv_map['being-human-us'] = 'faulty2';
//eztv_map['battlestar-galactica-2003'] = 'faulty2';
eztv_map['atlantis-2013'] = 'atlantis-1969';
eztv_map['archer-2009'] = 'archer';
eztv_map['the-apprentice-uk'] = 'the-apprentice';
eztv_map['the-apprentice-us'] = 'the-apprentice-2004';
eztv_map['andrew-marrs-history-of-the-world'] = 'faulty';
//eztv_map['louie'] = 'louie-2010';
//eztv_map['american-crime'] = 'faulty';
eztv_map['americas-next-top-model'] = 'america-s-next-top-model';
//eztv_map['americas-got-talent'] ='faulty';
//eztv_map['americas-funniest-home-videos'] = 'faulty';
//eztv_map['a-young-doctors-notebook'] = 'faulty';
//eztv_map['battlestar-galactica'] = 'battlestar-galactica-2003';
//eztv_map['the-killing'] = 'the-killing-us';
eztv_map['60-minutes-us'] = '60-minutes';
eztv_map['the-academy-awards-oscars'] = 'the-academy-awards';
eztv_map['the-739']='th22e-739';
eztv_map['accused-uk'] = 'accused';
eztv_map['arachnoquake'] = 'arachnoquake-2012';
eztv_map['bad-education-uk'] = 'bad-education';
eztv_map['barabbas'] = 'barabbas-2013';
eztv_map['the-beautiful-life'] = 'the-beautiful-life-tbl';
//eztv_map['beavis-and-butt-head'] = 'beavis-and-butthead';
eztv_map['big-brother-us'] = 'big-brother';
eztv_map['bill-cosby-far-from-finished-2013'] = 'bill-cosby-far-from-finished';
eztv_map['born-survivor-bear-grylls'] = 'bear-grylls-extreme-survival-caught-on-camera';
eztv_map['boy-meets-girl-2009'] = 'boy-meets-girl';
//eztv_map['dont-trust-the-b--in-apartment-23'] = 'dont-trust-the-b-in-apartment-23';
//eztv_map['flowers-in-the-attic-2014'] = 'flowers-in-the-attic';
//eztv_map['frys-planet-word-'] = 'frys-planet-word';
eztv_map['good-game-2010'] = 'good-game';
//eztv_map['hatfields-and-mccoys-2012'] = 'hatfields-and-mccoys';
//eztv_map['the-hour-uk-2011'] = 'the-hour-2011';
//eztv_map['the-lady-vanishes-2013'] = 'the-lady-vanishes';
//eztv_map['lifes-too-short-uk'] = 'lifes-too-short';
//eztv_map['mad-love-'] = 'mad-love';
eztv_map['matador-us'] = 'matador-2014';
eztv_map['mayday-uk-2013'] = 'mayday-uk';
eztv_map['nashville-2012'] = 'nashville';
eztv_map['national-geographic'] = 'national-geographic-documentaries';
eztv_map['never-mind-the-buzzcocks-uk'] = 'never-mind-the-buzzcocks';
//eztv_map['newswipe-with-charlie-brooker'] = 'charlie-brookers-weekly-wipe';
eztv_map['otherworlds-2014'] = 'otherworlds';
eztv_map['played-ca'] = 'played';
eztv_map['prey-uk'] = 'prey';
//eztv_map['prime-suspect-2011'] = 'prime-suspect-us';
eztv_map['reckless-us'] = 'reckless-2014';
eztv_map['hawaii-five-0-2010'] = 'hawaii-five-0';
eztv_map['the-goldbergs'] = 'the-goldbergs-2013';
eztv_map['vikings-us'] = 'vikings';
eztv_map['resurrection-us'] = 'resurrection';
eztv_map['golden-boy'] = 'golden-boy-2013';
//eztv_map['the-office'] = 'the-office-us';
eztv_map['the-fosters'] = 'the-fosters-2013';
//eztv_map['brooklyn-nine-nine'] = 'brooklyn-ninenine';
eztv_map['cracked'] = 'cracked-2013';
eztv_map['the-good-guys'] = 'the-good-guys-2010';
//eztv_map['black-box'] = 'the-black-box';
eztv_map['hank'] = 'hank-2009';
eztv_map['legit'] = 'legit-2013';
eztv_map['power-2014'] = 'power';
eztv_map['scandal-us'] = 'scandal';
eztv_map['dancing-with-the-stars-us'] = 'dancing-with-the-stars-us';
eztv_map['jim-jefferies-bare-2014'] = 'jim-jefferies';
eztv_map['forever-us-2014'] = 'forever-2014';
eztv_map['dancing-with-the-stars-us'] = 'dancing-with-the-stars';
eztv_map['craig-ferguson-the-late-late-show-with'] = 'the-late-late-show-with-craig-ferguson';
eztv_map['childrens-hospital-us'] = 'childrens-hospital';
//eztv_map['bonnie-and-clyde-2013'] = 'bonnie-and-clyde';
//eztv_map['the-neighbors-2012'] = 'the-neighbors';
eztv_map['the-mole-us'] = 'the-mole';
eztv_map['mistresses-uk'] = 'mistresses-2008';
//eztv_map['missing-2009'] = 'the-missing';
eztv_map['marry-me-2014'] = 'marry-me-2014';
eztv_map['the-missing-us-and-uk'] = 'the-missing';
eztv_map['houdini-2014'] = 'houdini';
//eztv_map['eleventh-hour'] = 'eleventh-hour-us';


exports.getAllShows =   function(cb) {
    if(cb == null) return;
        request(BASE_URL + SHOWLIST, function(err, res, html){

        if(err) return (err, null);

        var $ = cheerio.load(html);
        var title, show;
        var allShows = [];
        allShows.push({show: 'sense8', id: false, slug: 'sense8'});
        allShows.push({show: 'the good wife', id: '322', slug: 'the-good-wife'});
        allShows.push({show: 'The Brink', id: false, slug: 'the-brink'});
        allShows.push({show: 'Mr Robot', id: false, slug: 'mr-robot'});
        allShows.push({show: 'the interceptor', id: false, slug: 'the-interceptor'});
        allShows.push({show: 'ballers', id: false, slug: 'ballers'});
        allShows.push({show: 'dark matter', id: false, slug: 'dark-matter'});
        allShows.push({show: 'shark tank', id: false, slug: 'shark-tank'});
        allShows.push({show: 'nashville', id: 724, slug: 'nashville-2012'});
        allShows.push({show: 'the comedians', id: false, slug: 'the-comedians-2015'});
        allShows.push({show: 'wayward pines', id: false, slug: 'wayward-pines'});
              allShows.push({show: 'daredevil', id: false, slug: 'marvel-s-daredevil'});
              allShows.push({show: 'Wentworth', id: false, slug: 'Wentworth'});
        allShows.push({show: 'The Messengers', id: false, slug: 'the-messengers'});
              allShows.push({show: 'code killer', id: false, slug: 'code-of-a-killer-2015', force: true});
              allShows.push({show: 'Marvels Agents', id: false, slug: 'marvel-s-agents-of-s-h-i-e-l-d'});
              allShows.push({show: 'the bible continues', id: false, slug: 'a-d-the-bible-continues-2015'});


        $('.thread_link').each(function(){
            var entry = $(this);
            var show = entry.text();

            // The showlist changed by linking the image as well
            if (!show) {
            	return;
            }

            var id = entry.attr('href').match(/\/shows\/(.*)\/(.*)\//)[1];
            var slug = entry.attr('href').match(/\/shows\/(.*)\/(.*)\//)[2];
            slug = slug in eztv_map ? eztv_map[slug]: slug;
            allShows.push({show: show, id: id, slug: slug});
        });

        return cb(null, allShows);
        });
}


exports.getAllEpisodes = function(data, cb) {
    if (cb === null) return;
    var episodes = {};
    var missings = [];

    var match_title = function (title) {
      var matcher = title.match(/S(\d{2})E(\d{2})/i); // s01e01
      if (matcher == null) {
          matcher = title.match(/(\d{4})[^p]/i); // 0101

          // remove datebased '2014 08 22'
          var _matcher = title.match(/(\d{4}\W\d)/i);
          if (_matcher !== null) return null;

          if (matcher !== null) {
              matcher[2] = parseInt(matcher[1].substr(2,4));
              matcher[1] = parseInt(matcher[1].substr(0,2));
          } else {
              matcher = title.match(/(\d{3}[^p])/i); // 101
              if (matcher !== null) {
                  matcher[2] = parseInt(matcher[1].substr(1,2));
                  matcher[1] = parseInt(matcher[1].substr(0,1));
              }
          }
      }
      return matcher;
  };

    if (data.id != false) {
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
                    var title = entry.children('td').eq(1).text().replace(/[xh]26\d/i, ''); // temp fix
                    //var magnet = entry.children('td').eq(2).children('a').first().attr('href');
                    var allLinks = entry.children('td').eq(2).children('a');
                    var magnet = false;
                    allLinks.each(function( index ) {
                        var thisUrl = $( this ).attr('href');
                        if (!magnet) {
                            if (thisUrl.match(/magnet/i) !== null) {

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
                              
                            }
                        }
                    }
                });
            }

          
            // https://getstrike.net/api/v2/torrents/search/?phrase=#slug
            //var strikeUrl = "https://getstrike.net/api/v2/torrents/search/?category=TV&key=f9cE6zj7s7svvhPY22mgmh2182X814Im&phrase=" + data.show.replace(',','').replace(' ','+');
            var strikeUrl = "https://getstrike.net/api/v2/torrents/search/?category=TV&key=f9cE6zj7s7svvhPY22mgmh2182X814Im&phrase=" + data.show.replace(',','').replace(' ','+');

            request.get(strikeUrl, function (err, res, json) {

                json = JSON.parse(json);

                if (!json.statuscode || json.statuscode !== 200 || err) {

                    return cb(null, episodes);
                } else {

                    json.torrents.forEach(function(torrent) {

                      var title = torrent.torrent_title.replace(/[xh]26\d/i, '');  // temp fix
                      var magnet = torrent.magnet_uri;
                      var seedn = torrent.seeds;
                      var filter = torrent.torrent_title;
                      var matcher = match_title(title);
                      var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";
                      title = title.replace(/[xh]26\d/i, '');
title = title.replace(/\./g, ' ');
var x264lol = title.match(/\WLOL/i);
var x264k = title.match(/\WKILLERS/i);
var x2642hd = title.match(/\W2HD/i);
var x264o = title.match(/\WORENJI/i);
var x264IMMERSE = title.match(/\WIMMERSE/i);
var x264mSD = title.match(/\WmSD/i);
var x264DIMENSION = title.match(/\WDIMENSION/i);
var x264xRed = title.match(/\WxRed/i);
var eztv = title.match(/eztv/i);
var ettv = title.match(/ettv/i);
var rartv = title.match(/rartv/i);
var xvid1 = title.match(/XviD-ASAP/i);
var xvid2 = title.match(/XviD-FQM/i);
var rarbg = title.match(/rargb/i);
var SNEAkY = title.match(/SNEAkY/i);
var abjex = title.match(/abjex/i);
var xvid = title.match(/xvid/i);
var publichd = title.match(/PublicHD/i);
var link = title.match(/http/);


if (seedn> '5' && !xvid && !link && (xvid1 || xvid2 || x264lol || x264k || x2642hd || x264o || x264IMMERSE || x264mSD || x264DIMENSION ||  x264xRed || rartv || ettv || publichd || eztv || SNEAkY || rarbg || abjex)) {




                            if(matcher) {
                                var season = parseInt(matcher[1], 10);
                                var episode = parseInt(matcher[2], 10);
                                var torrent = {};

                                // we confirm its a missing file
                            
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

        request.get(strikeUrl, function (err, res, json) {

            json = JSON.parse(json);

            if (!json.statuscode || json.statuscode !== 200 || err) {

                return cb(null, episodes);
            } else {

                json.torrents.forEach(function(torrent) {

                  var title = torrent.torrent_title.replace(/[xh]26\d/i, '');  // temp fix
                  var magnet = torrent.magnet_uri;
                  var seedn = torrent.seeds;
                  var filter = torrent.torrent_title;
                  var matcher = match_title(title);
                  var quality = title.match(/(\d{3,4})p/i) ? title.match(/(\d{3,4})p/i)[0].toLowerCase() : "480p";
                  title = title.replace(/[xh]26\d/i, '');
                  title = title.replace(/\./g, ' ');
                  
                  title = title.replace(/[xh]26\d/i, '');
title = title.replace(/\./g, ' ');
var x264lol = title.match(/\WLOL/i);
var x264k = title.match(/\WKILLERS/i);
var x2642hd = title.match(/\W2HD/i);
var x264o = title.match(/\WORENJI/i);
var x264IMMERSE = title.match(/\WIMMERSE/i);
var x264mSD = title.match(/\WmSD/i);
var x264DIMENSION = title.match(/\WDIMENSION/i);
var x264xRed = title.match(/\WxRed/i);
var eztv = title.match(/eztv/i);
var ettv = title.match(/ettv/i);
var rartv = title.match(/rartv/i);
var xvid1 = title.match(/XviD-ASAP/i);
var xvid2 = title.match(/XviD-FQM/i);
var rarbg = title.match(/rargb/i);
var SNEAkY = title.match(/SNEAkY/i);
var abjex = title.match(/abjex/i);
var xvid = title.match(/xvid/i);
var publichd = title.match(/PublicHD/i);
var link = title.match(/http/);


if (seedn> '5' && !xvid && !link && (xvid1 || xvid2 || x264lol || x264k || x2642hd || x264o || x264IMMERSE || x264mSD || x264DIMENSION ||  x264xRed || rartv || ettv || publichd || eztv || SNEAkY || rarbg || abjex)) {

                

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

