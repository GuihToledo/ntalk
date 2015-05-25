module.exports = function(io) {
	var crypto = require('crypto')
		, md5 = crypto.createHash('md5')
		sockets = io.sockets;

	sockets.on('connection', function (client) {
		var session = client.handshake.session
		, usuario = session.usuario;
		client.on('send-server', function (msg) {
			var msg = "<b>"+ usuario.nome +":</b> "+ msg +"<br>";
			client.get('sala', function(erro, sala) {
				var data = {email: usuario.email, sala: sala};
				client.broadcast.emit('new-message', data);
				sockets.in(sala).emit('send-client', msg);
				console.log("SALAAAA ENTRADA ->>" + sala);
			});
		});

		client.on('join', function(sala) {
			console.log("Entrou Join");
			if(sala) {
				sala = sala.replace('?','');
			} else {
				var timestamp = new Date().toString();
				var md5 = crypto.createHash('md5');
				sala = md5.update(timestamp).digest('hex');
			}
			client.set('sala', sala);
			console.log("SALA JOIN->>" + sala);
			client.join(sala);
		});

		client.on('disconnect', function () {
			client.get('sala', function(erro, sala) {
				console.log("SALAAAA ->>" + sala);
				client.leave(sala);
			});
		});
	});
}