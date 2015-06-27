module.exports = {
	master: true,
	port: 5002,
	workers: 3,
	scrapeTime: '60 00 * * * *',
	pageSize: 50000,
	dbHosts: [
		'fr.ptnet',
		'us-chi.ptnet',
		'us-mia.ptnet',
		'us-dal.ptnet',
		'us-sjc.ptnet',
		'za.ptnet',
		'br.ptnet',
		'sg.ptnet',
		'uk.ptnet',
		'ca.ptnet'
	],
	analyticsHost: 'fr.ptnet'
}
