/**
 * Created by simba on 8/6/15.
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Movie', {
        "id": { type: Number, required: true, index: { unique: true } },
        "url":String,
        "imdb_code":String,
        "title":String,
        "title_long":String,
        "slug":String,
        "year":Number,
        "rating":Number,
        "runtime":Number,
        "genres":[],
        "language":String,
        "mpa_rating":String,
        "download_count":Number,
        "like_count":Number,
        "rt_critics_score":Number,
        "rt_critics_rating":String,
        "rt_audience_score":Number,
        "rt_audience_rating":String,
        "description_intro":String,
        "description_full":String,
        "yt_trailer_code":String,
        "date_uploaded":String,
        "date_uploaded_unix": Date,
        "torrents":[],
        "background_image": String,
        "small_cover_image": String,
        "medium_cover_image": String,
        "state": String,
        "last_updated": Number
    }
);
