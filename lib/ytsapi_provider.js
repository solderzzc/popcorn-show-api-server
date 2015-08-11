/**
 * Created by simba on 8/10/15.
 */

var yts = require('./yts.js');

exports.getAllMovies =  function(cb) {

    yts.listAllMovies({}, function (err, json) {
        if (err || !json) {
            return cb(err,null)
        }
        if (json.data && json.data.movies && json.data.movies.length > 1) {
            console.log('Total length json.data.movies.length ' + json.data.movies.length);
            return cb(null,json.data.movies)
        } else {
            return cb(err,null)
        }
    });
}

