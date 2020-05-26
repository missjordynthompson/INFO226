var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
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

	$scope.coursedata = [
		{"ID":"INFO226","Name":"Application Development","Overview":"An introduction to the use of software languages and tools for rapid application development.","Year":2018,"Trimester":"1","LectureTimes":"Thursday 12.40pm","LecturerID":"1"},
		{"ID":"INFO234","Name":"Business Process Design","Overview":"This course will explore the role and potential of IT to support business process management and design.","Year":2018,"Trimester":"2","LectureTimes":"Wednesday 10.30am","LecturerID":"2"}
	];

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
