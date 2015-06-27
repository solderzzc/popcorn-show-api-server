/*************************
**  Modules     **
**************************/

var request =   require('request');
var cheerio =   require('cheerio');
var moment  =   require('moment');

/*************************
**  Variables   **
**************************/

var BASE_URL    =   "http://eztv.ch/";
var SHOWLIST    =   "/showlist/";
var LATEST  =   "/sort/100/";
var SEARCH  =   "/search/";
var SHOWS   =   "/shows/";

var eztv_map = [];
eztv_map['american-idol'] = 'american-idol';
eztv_map['the-bridge-us'] = 'the-bridge-2013';
eztv_map['bobs-burgers'] = 'bob-s-burgers';
eztv_map['ascension'] = 'ascension';
eztv_map['once-upon-a-time'] = 'once-upon-a-time-2011';
eztv_map['teen-wolf'] = 'teen-wolf-2011';
eztv_map['the-librarians'] = 'the-librarians';
eztv_map['wilfred-us'] = 'wilfred';
eztv_map['undercover-boss-us'] = 'undercover-boss-2010';
eztv_map['shameless-us'] = 'shameless-2011';
//eztv_map['rizzoli-and-isles'] = 'faulty';
//eztv_map['the-ricky-gervais-show'] = 'faulty';
//eztv_map['richard-hammonds-crash-course'] = 'faulty';
eztv_map['revolution-2012'] = 'revolution';
eztv_map['rake-us'] = 'rake';
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
//eztv_map['the-x-factor-us'] = 'faulty';
//eztv_map['the-x-factor'] = 'faulty';
eztv_map['tosh0'] = 'tosh-0';
//eztv_map['the-la-complex'] = 'faulty';
//eztv_map['survivors-remorse'] = 'faulty';
//eztv_map['stephen-fry-gadget-man'] = 'faulty';
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
eztv_map['the-tomorrow-people-us'] = 'the-tomorrow-people';
//eztv_map['its-always-sunny-in-philadelphia'] = 'faulty';
eztv_map['the-inbetweeners-us'] = 'the-inbetweeners';
//eztv_map['human-target-2010'] = 'faulty';
//eztv_map['how-to-live-with-your-parents'] = 'faulty';
eztv_map['house-of-cards-2013'] = 'house-of-cards';
//eztv_map['hit-and-miss'] = 'faulty';
//eztv_map['mistresses-us'] = 'faulty';
//ztv_map['hells-kitchen-uk'] = 'faulty';
//eztv_map['hells-kitchen-us'] = 'faulty';
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
//eztv_map['americas-next-top-model'] = 'faulty';
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
//eztv_map['forever-us-2014'] = 'forever-us';
eztv_map['dancing-with-the-stars-us'] = 'dancing-with-the-stars';
eztv_map['craig-ferguson-the-late-late-show-with'] = 'the-late-late-show-with-craig-ferguson';
eztv_map['childrens-hospital-us'] = 'childrens-hospital';
//eztv_map['bonnie-and-clyde-2013'] = 'bonnie-and-clyde';
//eztv_map['the-neighbors-2012'] = 'the-neighbors';
eztv_map['the-mole-us'] = 'the-mole';
eztv_map['mistresses-uk'] = 'mistresses';
eztv_map['missing-2009'] = 'the-missing';
eztv_map['marry-me-2014'] = 'marry-me';
eztv_map['houdini-2014'] = 'houdini';
//eztv_map['eleventh-hour'] = 'eleventh-hour-us';

exports.getAllShows =   function(cb) {
    if(cb == null) return;
        request(BASE_URL + SHOWLIST, function(err, res, html){

        if(err) return (err, null);

        var $ = cheerio.load(html);
        var title, show;
        var allShows = [];

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
	console.log(allShows);
        return cb(null, allShows);
        });
}

exports.getAllEpisodes = function(data, cb) {
    if(cb == null) return;
    var episodes = {};

    request.get(BASE_URL + SHOWS + data.id + "/"+ data.slug +"/", function (err, res, html) {
        if(err) return cb(err, null);
	console.log(html);
        var $ = cheerio.load(html);

        var show_rows = $('tr.forum_header_border[name="hover"]').filter(function() {
            episode_rows = $(this).children('.forum_thread_post');
            if(episode_rows.length > 0) {
                var title = $(this).children('td').eq(1).text();

                if(title.indexOf("-CTU") > -1)
                    return false;
                else
                    return true;
                
            }
            return false;
        });

        if(show_rows.length === 0) return cb("Show Not Found", null);

        show_rows.each(function() {
            var entry = $(this);
            var title = entry.children('td').eq(1).text().replace('x264', ''); // temp fix
            var magnet = entry.children('td').eq(2).children('a').first().attr('href');
            var matcher = title.match(/S?0*(\d+)?[xE]0*(\d+)/);
            var quality = title.match(/(\d{3,4})p/) ? title.match(/(\d{3,4})p/)[0] : "480p";
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
        });

        return cb(null, episodes);
    });
}
