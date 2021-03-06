var cluster = require('cluster')
  , app = require('express')()
  , cpuCount = require('os').cpus().length;

// settings
var config = require('./config.js');
// config
require('./setup.js')(config, app);
// routes
require('./routes.js')(app);

if(cluster.isMaster) {

    // Fork the child threads
    for (var i = 0; i < Math.min(cpuCount, config.workers); i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died, spinning up another!');
        cluster.fork();
    });

    // Is this the master API server? If so scrape
    if(config.master) {
        var helpers = require('./lib/helpers_eztvapi');
        // Launch the eztv scraper
        try {
            var CronJob = require('cron').CronJob;
            var job = new CronJob(config.scrapeTime, 
                function(){
                    helpers.refreshDatabase();
                }, function () {
                    // This function is executed when the job stops
                },
                true
            );
            console.log("Cron job started");
        } catch(ex) {
            console.log("Cron pattern not valid");
        }

        var helpers_ytsapi = require('./lib/helpers_ytsapi');
        try {
            var job2 = new CronJob(config.scrapeTime,
                function(){
                    helpers_ytsapi.refreshDatabase();
                }, function () {
                    // This function is executed when the job stops
                },
                true
            );
            console.log("Cron job started");
        } catch(ex) {
            console.log("Cron pattern not valid");
        }
        // Start extraction right now
        helpers.refreshDatabase();
        helpers_ytsapi.refreshDatabase();
    }
} else {
    app.listen(config.port);
}
