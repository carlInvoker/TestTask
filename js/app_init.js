(function() {

	var app = Sammy('body');
	app.use(Sammy.Mustache, 'tpl');

    // route to start
	$(document).ready(function() {
		app.run('#/');
	});

    app.setLocation('#/');
    return;

})();