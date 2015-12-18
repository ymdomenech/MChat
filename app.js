
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , chat = require('./routes/chat')
  , http = require('http')
  , path = require('path')
  , socket = require('socket.io')
  ;

var app = express();


// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/chat', chat.chat);
app.post('/chat', chat.postChat);

server = http.createServer(app)
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var io = socket(server);

io.on('connection', function (socket) {

	  socket.on('clientMessage', function (content) {
		  var nombre_dest= JSON.parse(content).nombre_dest;		  
		  var mensaje= JSON.parse(content).mensaje;		  
		  var username = socket.username?socket.username: socket.id ;
		  
		  socket.emit('serverMessage', 'You said: ' + mensaje);
		  socket.broadcast.to(nombre_dest);
		  socket.broadcast.emit('serverMessage', username + ' said: ' +
				  mensaje);
	  });
	  
	  socket.on('login', function(username) {
			socket.username=username;
			socket.emit('serverMessage', 'Currently logged in as ' + username);
			socket.broadcast.emit('serverMessage', 'User ' + username +
				' logged in');
			socket.join(username);			
		});
	  
	  socket.on('disconnect', function() {
		  var username = socket.username?socket.username: socket.id ;			
		  socket.broadcast.emit('serverMessage', 'User ' + username + ' disconnected');	
		  socket.leave(username);
	  });
	});



