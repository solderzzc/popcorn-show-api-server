var Metric = require('../models/Metric');

module.exports = {

	Type: {
		Movie: 1,
		TV: 2,
		Other: 3
	},

	track: function(req, type, query) {

		if(typeof query === 'object')
			query = JSON.stringify(query);

		var metric = new Metric({
			time: new Date(),
			ip: req.ip,
			route: req.route.path,
			type: type || this.Type.Other,
			query: query || ''
		});

		metric.save();
	}

}