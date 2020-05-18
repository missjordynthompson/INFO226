var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http, $filter) {
	$scope.showLogin = true;
	$scope.showDashboard = false;
	$scope.studentUser = false;
	$scope.lecturerUser = false;

	$scope.showStudentDashboard = false;
	$scope.showLecturerDashboard = false;

	//Sample hash map of usernames and passwords
	var sampleCredentials = new Map([
		["jake", "1234"],
		["jordyn", "1234"],
		["jesse", "1234"]
    ]);
    
	$scope.getcourses = "https://caab.sim.vuw.ac.nz/api/tukukipaul/course_directory.json";
  	$http.get($scope.getcourses)
    .then(function successCall(response) {
      $scope.coursedata = response.data.courses;
	});
	
	$scope.getassignments = "https://caab.sim.vuw.ac.nz/api/tukukipaul/assignment_directory.json";
  	$http.get($scope.getassignments)
    .then(function successCall(response) {
      $scope.assignmentdata = response.data.assignments;
    });
	
	//Simple credential check function
	$scope.checkCred = function () {
		// alert("HI");
		if ($scope.userInp != null && $scope.userPwd != null) {
			if (sampleCredentials.has($scope.userInp)) {
				if ($scope.userPwd == sampleCredentials.get($scope.userInp)) {
					$scope.showLogin = false;
					$scope.showDashboard = true;
				} else {
					alert ("Username or Password is invalid");
				}
			} else {
				alert("Username or Password is invalid");
			}
		}
	}

	// Navigation Bar Scroll
	window.onscroll = function() { myFunction() };
	var header = document.getElementById("myHeader");
	var sticky = header.offsetHeight;
	function myFunction() {
		if (window.pageYOffset >= sticky/2) {
			header.classList.add("sticky");
		} else {
			header.classList.remove("sticky");
		}
	}

	// Accordion in My Courses Section
	for (var i = 0; i < 4; i++) {
		$scope["accordion" + i] = false;
	}

	$scope.accordionFunction = function(index) {
		if ($scope["accordion" + index] === true) {
			$scope["accordion" + index] = false;
		} else {
			$scope["accordion" + index] = true;
		}
	}
	// Accordion in My Courses Section
	for (var i = 0; i < 4; i++) {
		$scope["accordion" + i] = false;
	}

	$scope.accordionFunction = function(index) {
		if ($scope["accordion" + index] === true) {
			$scope["accordion" + index] = false;
		} else {
			$scope["accordion" + index] = true;
		}
	}
}]);
