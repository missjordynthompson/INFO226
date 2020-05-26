var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	$scope.showLogin = true;
	$scope.showDashboard = false;
	$scope.studentUser = false;
	$scope.lecturerUser = false;

	// Get all users
	$scope.getusers = "https://caab.sim.vuw.ac.nz/api/thompsjord/user_list.json";
  	$http.get($scope.getusers)
    .then(function successCall(response) {
      $scope.userdata = response.data.users;
	});

	// Get all courses
	$scope.getcourses = "https://caab.sim.vuw.ac.nz/api/thompsjord/course_directory.json";
  	$http.get($scope.getcourses)
    .then(function successCall(response) {
      $scope.coursedata = response.data.courses;
	});

	// Get all assignments
	$scope.getassignments = "https://caab.sim.vuw.ac.nz/api/thompsjord/assignment_directory.json";
  	$http.get($scope.getassignments)
    .then(function successCall(response) {
      $scope.assignmentdata = response.data.assignments;
	});

	$scope.assignmentdata = [
		{"ID":"1","Name":"Assignment 1","Overview":"Build a Web application that allows the management of...","CourseID":"INFO226","DueDate":"2018-08-01T00:00:00"},
		{"ID":"2","Name":"Assignment 1","Overview":"Create a ","CourseID":"INFO234","DueDate":"2018-08-01T00:00:00"}
	];
	
	//Simple credential check function
	$scope.checkCred = function () {
		// alert("HI");
		if ($scope.userInp != null && $scope.userPwd != null) {
			if (sampleCredentials.has($scope.userInp)) {
				if ($scope.userPwd == sampleCredentials.get($scope.userInp)) {
					$scope.showLogin = false;
					$scope.showDashboard = true;
				} else {
					$scope.feedback = "Incorrect login details";
					$scope.userInp = null;
					$scope.userPwd = null;
				}
			} else {
				$scope.feedback = "Incorrect login details";
				$scope.userInp = null;
				$scope.userPwd = null;
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
