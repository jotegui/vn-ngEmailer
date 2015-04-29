'use strict';

var Controllers = angular.module('Controllers', []);

Controllers.controller('MainController', ['$scope', '$filter', 'providers', 'Issue',
	function MainController($scope, $filter, providers, Issue) {
		
		// Initialize
		$scope.sendBtn = "Send!";
		$scope.selectedItems = [];
		$scope.listItems = [];
		$scope.issue = {
			title: "",
			body: ""
		}
		console.log($scope.issue);

		// Get list of providers
		providers.get({},
			function success(response){
				console.log("Got providers");
				$scope.listItems = response.rows;
				$scope.listItems.push({
					name: 'jotegui/statReports',
					github_orgname: 'jotegui',
					github_reponame: 'statReports'
				})
			},
			function error(errorResponse) {
				console.log("Error getting providers' list");
			}
		);

		// Select providers
		$scope.addProvider = function(provider) {
			if ($scope.selectedItems.indexOf(provider) == -1) {
				console.log("adding "+provider.name);
				$scope.selectedItems.push(provider);
			} else {
				console.log("duplicate, skipping");
			}
		};

		// Add all providers in view
		$scope.addAll = function(listItems) {
			console.log("adding all providers");
			for (var i=0; i<$scope.filteredItems.length; i++) {
				$scope.addProvider($scope.filteredItems[i]);
			}
		}

		// De-select providers
		$scope.removeProvider = function(provider) {
			console.log("removing "+provider.name);
			$scope.selectedItems.splice($scope.selectedItems.indexOf(provider), 1);
		};
		
		// De-select all providers
		$scope.removeAll = function() {
			console.log("removing all providers");
			$scope.selectedItems = [];
		}

		// Clear filter
		$scope.clearFilter = function() {
			console.log("clearing search filter");
			$scope.searchName = "";
		}

		// Send issue
		$scope.sendIssue = function() {
			$scope.sendBtn = 'Sending...';
			$scope.isPosting = true;
			console.log("sending issue with title "+$scope.issue.title+" and body "+$scope.issue.body);
			var issue = new Issue();
			$scope.issue.providers = $scope.selectedItems;
			issue.data = $scope.issue
			Issue.save(issue, function(res){
				console.log("POST sent");
				if (res.resp == 'failed') {
					$scope.failed = res.failed;
				} else {
					$scope.failed = [];
					$scope.selectedItems = [];
					$scope.searchName = "";
				}
				$scope.sendBtn = "Send!";
				$scope.isPosting = false;
			});
		}
	}
]);