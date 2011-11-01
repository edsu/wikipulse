var fs = require('fs'),
    path = require('path'),
    irc = require('irc-js'),
    redis = require('redis').createClient();

function getConfig() {
  configFile = path.join(__dirname, 'config.json');
  return JSON.parse(fs.readFileSync(configFile));
}

function main() {
  config = getConfig();
  channels = [];
  for (var chan in config.wikipedias) { channels.push(chan); }

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
    client.join(channels);
    client.on('privmsg', processMessage);
  });
}

function processMessage(wikipedia) {
  m = parse_msg(msg.params);
  if (m) {
    console.log(wikipedia);
  }
}

function parse_msg(msg) {
  // i guess this means i have (at least) two problems now? :-D
  var m = /\x0314\[\[\x0307(.+?)\x0314\]/.exec(msg[1]);
  if (! m) { 
      console.log("failed to parse: " + msg);
      return null;
  } 
  var wikipedia = msg[0];
}

main();
