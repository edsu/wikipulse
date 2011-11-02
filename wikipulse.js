var fs = require('fs'),
    path = require('path'),
    irc = require('irc-js'),
    _ = require('underscore')._,
    redis = require('redis').createClient(),
    ttlIncrements = [60, 60*5, 60*15, 60*60, 60*60*24];

function main() {
  startMonitoring();
}

function getConfig() {
  configFile = path.join(__dirname, 'config.json');
  return JSON.parse(fs.readFileSync(configFile));
}

function startMonitoring() {
  config = getConfig();
  console.log(config.wikipedias);

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
    client.on('privmsg', processMessage);
  });
}

function processMessage(msg) {
  channel = msg.params[0];
  t = new Date()
  k = channel + "-" + t.getTime();
  _.each(ttlIncrements, function(ttl) {
    redis.setex(ttl + "-" + k, ttl, 1);
  });
}

main();
