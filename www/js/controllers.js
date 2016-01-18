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
			body: "",
			labels: []
		}
		$scope.issue.labels.push("report");
		console.log($scope.issue);

		// Get list of providers
		providers.get({},
			function success(response){
				console.log("Got providers");
				$scope.listItems = response.rows;
				
				// // Add testing rows
				// $scope.listItems.push({
				// 	name: 'jotegui/statReports',
				// 	github_orgname: 'jotegui',
				// 	github_reponame: 'statReports'
				// },{
				// 	name: 'jotegui/BIDDSAT',
				// 	github_orgname: 'jotegui',
				// 	github_reponame: 'BIDDSAT'
				// },{
				// 	name: 'jotegui/geo-taxo-quality',
				// 	github_orgname: 'jotegui',
				// 	github_reponame: 'geo-taxo-quality'
				// },{
				// 	name: 'jotegui/QualityAPI',
				// 	github_orgname: 'jotegui',
				// 	github_reponame: 'QualityAI'
				// })
				
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

		// Add label
		$scope.addLabel = function() {
			console.log();
			if ($scope.newLabel != "" && $scope.newLabel != undefined) {
				
				if ($scope.issue.labels.indexOf($scope.newLabel) == -1) {
					console.log("Adding label "+$scope.newLabel);
					$scope.issue.labels.push($scope.newLabel);
				} else {
					console.log("Label "+$scope.newLabel+" already exists, skipping.");
				}

				$scope.newLabel = "";
			}
		}

		// Remove label
		$scope.removeLabel = function(label) {
			console.log("Removing label "+label);
			$scope.issue.labels.splice($scope.issue.labels.indexOf(label), 1);
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


// EXTRA STUFF
/*
This directive allows us to pass a function in on an enter key to do what we want.
 */
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});