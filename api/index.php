<?php

require_once 'config.php';
require_once 'DB.php';
require_once 'functions.php';

require '../lib/php/vendor/autoload.php';

$app = new \Slim\App([
    'settings' => [
        'displayErrorDetails' => true
    ]
]);

$app->post('/data', 'getSelectData');

$app->run();
