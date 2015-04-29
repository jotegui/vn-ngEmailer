'use strict';

var app = angular.module('ProviderEmailer', [
	'Controllers',
	'Services'
]);

// To avoid confusion between Jinja2 templates and AngularJS expressions
// AngularJS expressions are now like {[{ expr }]}
app.config(['$interpolateProvider', '$locationProvider',
    function($interpolateProvider, $locationProvider) {
        $interpolateProvider.startSymbol('{[{');
        $interpolateProvider.endSymbol('}]}');
        $locationProvider.html5Mode(false).hashPrefix('!');
    }
]);