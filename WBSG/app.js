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
	
	// Login Function
	$scope.checkCred = function () {
		if ($scope.username != null && $scope.password != null) {
			for (var i = 0; i < $scope.userdata.length; i++) {
				if ($scope.username == $scope.userdata[i].LoginName && $scope.password == $scope.userdata[i].Password) {
					$scope.invalidCredentials = false;
					$scope.ID = $scope.userdata[i].ID;
					
					$scope.showLogin = false;
					$scope.showDashboard = true;

					if ($scope.userdata[i].UserType == 'student') {
						$scope.type = 'student';
					} else if ($scope.userdata[i].UserType == 'lecturer') {
						$scope.type = 'lecturer';		
				}
			} else {
					$scope.invalidCredentials = true;
			}
		}
		} else {
			$scope.invalidCredentials = true;
	}
		document.getElementById("login-popup-userinput").value = "";
		document.getElementById("login-popup-passwordinput").value = "";
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

	// User log out
	$scope.logout = function() {
		$scope.showLogin = true;
		$scope.showDashboard = false;
	}

	// Accordion in My Courses Section
	for (var i = 0; i < 4; i++) {
		$scope["accordion" + i] = false;
	}
	$scope.accordionFunction = function(index) {
		$scope["accordion" + index] = !$scope["accordion" + index];
	}
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
