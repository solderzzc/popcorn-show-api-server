var analytics = require('../lib/analytics');
var os = require("os");
module.exports = {
	getIndex: function(req, res) {
		analytics.track(req);
		res.json({
			status: 'online', 
			uptime: process.uptime() | 0, 
			server: os.hostname()
		});
	}
}
