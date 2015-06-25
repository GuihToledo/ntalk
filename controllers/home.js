module.exports = function(app) {

	var UsuarioModel = app.models.usuario;

	var HomeController = {
		index: function(req, res) {
			res.render('home/index');
		},

		login: function(req, res) {
			var query = {email: req.body.usuario.email};
			UsuarioModel.findOne(query)
				.select('nome email')
				.exec(function(erro, usuario){

				if (usuario) {
					req.session.usuario = usuario;
					res.redirect('/contatos');
				} else {
					UsuarioModel.create(req.body.usuario, function(erro, usuario) {
						if(erro){
							res.redirect('/');
						} else {
							console.log('USUARIO >' + usuario.email);
							req.session.usuario = usuario;
							
							res.redirect('/contatos');
						}
					});
				}
			});
		},

		logout: function(req, res) {
			req.session.destroy();
			res.redirect('/');
		}
	};
	return HomeController;
};