<?php

define("DEBUG", true);

if (DEBUG) {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

class Config {
    static $DB_SERVER    = 'localhost';
    static $DB_NAME      = 'database1';
    static $DB_USERNAME  = 'root';
    static $DB_PASSWORD  = '';
}
