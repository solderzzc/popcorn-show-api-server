var config = require('../config');
var mongoose = require('mongoose').createConnection('mongodb://' + config.analyticsHost + '/metrics');

module.exports = mongoose.model('Metric', {
    time: Date,
    ip: String,
    route: String,
    type: Number,
    query: String
});
