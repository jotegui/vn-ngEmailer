'use strict';

var Services = angular.module('Services', ['ngResource']);

Services.factory('providers', ['$resource',
	function ($resource) {
		return $resource("/service/providers", {}, {
			get: {method: 'GET', isArray: false}
		});
	}
]);

Services.factory('Issue', ['$resource',
	function($resource) {
		return $resource("/service/emailer");
	}
]);