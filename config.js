module.exports = {
	master: true,
	port: 5000,
	workers: 3,
	scrapeTime: '60 00 * * * *',
	pageSize: 50000,
	dbHosts: [
		'10.1.10.16'
	],
	analyticsHost: '10.1.10.16'
}
