var fs = require('fs'),
    path = require('path'),
    irc = require('irc-js'),
    express = require('express'),
    _ = require('underscore')._,
    redis = require('redis').createClient(),
    ranges = [60000, 300000, 900000, 3600000, 86400000]; // millis

function main() {
  startMonitoring();
  startWebApp();
}

function getConfig() {
  configFile = path.join(__dirname, 'config.json');
  return JSON.parse(fs.readFileSync(configFile));
}

function startMonitoring() {
  var client = new irc({
    server: 'irc.wikimedia.org',
    nick: config.ircNick,
    log: config.log,
    user: {
      username: config.ircUserName,
      realname: config.ircRealName
    }
  })
  client.connect(function() {
    client.join(config.wikipedias);
    client.on('privmsg', processUpdate);
  });
}

function startWebApp() {
  var app = module.exports = express.createServer();
  app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
  });
  app.get('/stats/:wikipedia/:range.json', getStats);
  app.listen(config.webServerPort);
}

function processUpdate(msg) {
  wikipedia = msg.params[0];
  t = new Date().getTime();
  redis.zadd(wikipedia, t, t);
}

function getStats(req, res) {
  wikipedia = req.params.wikipedia;
  range = req.params.range;
  t = new Date().getTime();
  redis.zrangebyscore('#' + wikipedia, t - range, t, function(e, r) {
    res.send(r.length.toString());
  });
}

function purgeOld() {
  t = new Date().getTime();
  _.each(config.wikipedias, function(wikipedia) {
    _.each(ranges, function(range) {
      key = wikipedaia + "-" + range;
      cutoff = t - range;
      redis.zremrangebyscore(key, 0, cutoff);
    });
  });
}

function zresults(resp) {
  results = []
  for (var i=0; i < resp.length; i+=2) {
    r = JSON.parse(resp[i]);
    r['score'] = resp[i+1];
    results.push(r)
  }
  return results;
}

var config = getConfig();
main();
