wikipulse is a simple visualization of edits to various major language
wikipedias using node.js. The app connects to mediawiki IRC chatrooms 
where article edits are announced by a bot, and keeps track of the edits 
in redis. It also runs a webserver on the port specified in config.json.

1. `sudo aptitude install redis-server`
1. `npm install`
1. `node wikipulse.js`
1. point your browser at localhost:3000

License: Public Domain
