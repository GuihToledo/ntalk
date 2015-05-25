var express = require('express')
, app = express()
, load = require('express-load')
, error = require('./middleware/error')
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);


const KEY = 'ntalk.sid', SECRET = 'ntalk';
var cookie = express.cookieParser(SECRET)
, store = new express.session.MemoryStore()
, sessOpts = {secret: SECRET, key: KEY, store: store}
, session = express.session(sessOpts);


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookie);
app.use(session);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(error.notFound);
app.use(error.serverError);

  load('models')
    .then('controllers')
    .then('routes')
    .into(app);
  load('sockets')
    .into(io);

server.listen(3000, function(){
   console.log("Ntalk no ar.");
});