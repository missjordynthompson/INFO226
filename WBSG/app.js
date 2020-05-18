var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http, $filter) {
	
	// Boolean fields for showing/hiding components
	$scope.showLogin = true;
	$scope.showDashboard = false;
	$scope.invalidCredentials = false;

	$scope.studentUser = false;
	$scope.lecturerUser = false;

	$scope.showStudentDashboard = false;
	$scope.showLecturerDashboard = false;

	// HashMap of dummy credentials
	var sampleCredentials = new Map([
		["j", "j"],
		["jordyn", "1234"],
		["jesse", "1234"]
    ]);

    
	// Generate dummy json data
	$scope.courseData = [
			{
				"courseID": "ENGR301",
				"courseName": "Project Management",
				"courseDescription": "Project management including aspects of life cycle, requirements analysis, principles of design...",
				"availableIn": "Tri 1",
				"yearOffer": 2020,
				"timeSlot": "Monday - 14:10"
			},
			{
				"courseID": "CYBR371",
				"courseName": "System and Network Security",
				"courseDescription": "The course addresses key concepts, techniques and tools needed to provide security...",
				"availableIn": "Tri 1",
				"yearOffer": 2020,
				"timeSlot": "Tuesday - 12:00"
			}
	]

	$scope.assignmentData = [
		{
			"assignmentNo": "1",
			"assignmentTitle": "Mission-Control Software",
			"assignmentDescription": "Build a mission control software system for a hobby rocket project...",
			"courseID": "ENGR301",
			"dueDate": "22/5/2020 23:59",
			"weight": "30%"
		},
		{
			"assignmentNo": "2",
			"assignmentTitle": "Network Security",
			"assignmentDescription": "Demonstrate network attacks, counter measures...",
			"courseID": "CYBR371",
			"dueDate": "28/5/2020 23:59",
			"weight": "30%"
		}
	]

	
	// Simple credential check function
	$scope.checkCred = function() {
		if ($scope.userInp != null && $scope.userPwd != null) {
			if (sampleCredentials.has($scope.userInp)) {
				if ($scope.userPwd == sampleCredentials.get($scope.userInp)) {
					$scope.showLogin = false;
					$scope.showDashboard = true;
					$scope.invalidCredentials = false;

					// Clear login box once the user logged in
					document.getElementById("login-popup-userinput").value = "";
					document.getElementById("login-popup-passwordinput").value = "";
				} 
				else {
					$scope.invalidCredentials = true;
				}
			}
			else {
				$scope.invalidCredentials = true;
			}
		}
	}

	//Log out function, bring user to main login screen
	$scope.logout = function() {
		$scope.showLogin = true;
		$scope.showDashboard = false;
	}

	// Add New Assignments
	$scope.addAssignment = function() {
		// Still unsure on how new course will be created? Can we modify the json database?
		// if yes, then input will be parsed to create a new json object
		alert ("New assignment Added");
		document.getElementById("newass_1").value = "";
		document.getElementById("newass_2").value = "";
		document.getElementById("newass_3").value = "";
		document.getElementById("newass_4").value = "";
		document.getElementById("newass_5").value = "";
		document.getElementById("newass_6").value = "";
	}


	// Add New Courses
	$scope.addCourse = function() {
		// Still unsure on how new course will be created? Can we modify the json database?
		// if yes, then input will be parsed to create a new json object
		alert ("New course Added");
		document.getElementById("newcourse_1").value = "";
		document.getElementById("newcourse_2").value = "";
		document.getElementById("newcourse_3").value = "";
		document.getElementById("newcourse_4").value = "";
		document.getElementById("newcourse_5").value = "";
		document.getElementById("newcourse_6").value = "";
		document.getElementById("newcourse_7").value = "";
	}
	

	// Mark assignment as complete - work in progress 
	$scope.test = function() {
		console.log("test");
		document.getElementById("tick-button").id = "tick-button-clicked";
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
}]);
