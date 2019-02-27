(function() {

    var context;
    var app = Sammy.apps.body;

	app.get('#/', function() {

        context = this;

        context.render(
            './tpl/index.tpl',
            {},
            function(output) {
                document.title = 'Сотрудники';
    			$('#container').html(output);

                $('#employees').DataTable( {
                    "processing": true,
                    "serverSide": true,
                    "ajax": {
                        "url": "./api/data",
                        "type": "POST"
                    },
                    "columnDefs": [ 
                    { 
                        "targets":[3], // exeptions des ordres de triage
                        "orderable":false
                    } 
                    ]
                });
            }
        );
	});
})();
