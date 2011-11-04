var fs = require('fs'),
    path = require('path'),
    irc = require('irc-js'),
    express = require('express'),
    _ = require('underscore')._,
    redis = require('redis-url');

var db = redis.createClient(process.env.REDISTOGO_URL || "redis://localhost:6379");

function main() {
  db.flushall(); // hopefully I can remove this at some point
  purgeOld();
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
    app.use(express.logger());
    app.use(express.static(__dirname + '/public'));
  });
  app.get('/stats/:wikipedia/:range.json', getStats);
  app.listen(process.env.PORT || config.webServerPort);
}

function processUpdate(msg) {
  wikipedia = msg.params[0];
  t = new Date().getTime();
  db.zadd(wikipedia, t, t);
  db.zadd('#wikipedia', t, t);
}

function getStats(req, res) {
  wikipedia = req.params.wikipedia.replace("-", ".");
  range = req.params.range;
  t = new Date().getTime();
  db.zrangebyscore('#' + wikipedia, t - range, t, function(e, r) {
    res.send(r.length.toString());
  });
}

function purgeOld() {
  var t = new Date().getTime();
  var maxTime = 1000 * 60 * 1;
  var cutoff = t - maxTime; 
  db.zremrangebyscore('wikipedia', 0, cutoff);
  _.each(config.wikipedias, function(wikipedia) {
    db.zremrangebyscore(wikipedia, 0, cutoff);
  });
  setTimeout(purgeOld, maxTime);
}

var config = getConfig();
main();
