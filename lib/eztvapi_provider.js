/**
 * Created by simba on 8/3/15.
 */

var eztvapi = require('eztvapi');

var eztv = eztvapi({
    apiLimitRequests: 10,    // 10 requests
    apiLimitInterval: 60000  // per minute
});


var extractAllInformation = function(show,cb) {
    if(cb == null || !show || !show.imdb_id ) return;
    eztv.getShow(show.imdb_id, function (err, data) {
        if (err) {
            console.log('No such show or something');
            return cb(err,null)
        }/*
        //console.log(JSON.stringify(data));
        var episodes = {};// = data.episodes;
        if ( data.episodes ){
            console.log('episodes ' + JSON.stringify(data.episodes))
            for (var i = 0; i < data.episodes.length; i++ ){
                var show = data.episodes[i]
                var season = show.season
                var episode = show.episode
                console.log('show season ' + season + ' show episode ' + episode)

                if(!episodes[season]) episodes[season] = {};
                if(!episodes[season][episode]) episodes[season][episode] = {};
                if(show.torrents['480p'])  episodes[season][episode]['480p'] = show.torrents['480p']
                if(show.torrents['720p'])  episodes[season][episode]['720p'] = show.torrents['720p']
                if(show.torrents['1080p'])  episodes[season][episode]['1080p'] = show.torrents['1080p']

                console.log (episodes[season][episode]['480p'])
            }
        }
        episodes.dateBased = false;
        data.episodes = episodes
        */
        cb(null,data)
    });
}
exports.getAllShows =  function(cb) {
    if(cb == null) return;
    var tvShows = []
    var stream = eztv.createShowsStream();
    stream.on('data', function (show) {
        tvShows.push({
            show:show.title,
            id: show.id,
            slug: show.slug,
            imdb_id: show.imdb_id
        })
        console.log('['+ tvShows.length +']'+ JSON.stringify(show))
        //extractAllInformation(show,function(){})
    });
    stream.on('end', function () {
        console.log('All done')
        cb(null,tvShows)
    });
}

exports.extractAllInformation = extractAllInformation

