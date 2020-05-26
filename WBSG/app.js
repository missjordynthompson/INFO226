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

	// Mark assignment as complete
	for (var i = 0; i < 4; i++) {
		$scope["markedAssgn" + i] = false;
	}
	$scope.markAssignment = function(index) {
		if ($scope["markedAssgn" + index] == false) {
			$scope["markedAssgn" + index] = true;
		} else {
			$scope["markedAssgn" + index] = false;
		}
	};

	// Add new assignment
	$scope.addAssgnForm = true;
	$scope.addNewAssgn = function() {
		$scope.addAssgnForm = false;
		$scope.addedAssgn = true;

		var date = $filter('date')($scope.newAssignmentDueDate1,'yyyy-MM-dd');
		var time = $filter('date')($scope.newAssignmentDueDate2,'hh:mm:ss');
		var newAssignmentDueDate = date + "T" + time;
		var newAssignment = {
			"ID":$scope.newAssignmentID,
			"Name":$scope.newAssignmentName,
			"Overview":$scope.newAssignmentOverview,
			"CourseID":$scope.newAssignmentCourseID,
			"DueDate":newAssignmentDueDate,
	}
		$scope.assignmentdata.push(newAssignment);

		for (var i = 0; i < $scope.assignmentdata.length; i++) {
			if ($scope.assignmentdata[i].ID == $scope.newAssignmentID
				&& $scope.assignmentdata[i].Name == $scope.newAssignmentName
				&& $scope.assignmentdata[i].Overview == $scope.newAssignmentOverview
				&& $scope.assignmentdata[i].CourseID == $scope.newAssignmentCourseID
				&& $scope.assignmentdata[i].DueDate == newAssignmentDueDate){
				$scope.addAssgnFeedback = "Successfully added new assignment.";
	}
		}

		// change this with http error
		if ($scope.addAssgnFeedback != "Successfully added new assignment.") {
			$scope.addAssgnFeedback = "Error! Something went wrong :( Try again later.";
		}
	};

	// Reset add new assignment form
	$scope.resetAssgnForm = function() {
		$scope.addAssgnForm = true;
		$scope.addedAssgn = false;

		// clear all inputs
		$scope.newAssignmentID = "";
		$scope.newAssignmentID = "";
		$scope.newAssignmentName = "";
		$scope.newAssignmentOverview = "";
		$scope.newAssignmentCourseID = "";
		$scope.newAssignmentDueDate1 = "";
		$scope.newAssignmentDueDate2 = "";
	};

	// Add new course
	$scope.addCourseForm = true;
	$scope.addNewCourse = function() {
		$scope.addCourseForm = false;
		$scope.addedCourse = true;
			
		var time = $filter('date')($scope.newCourseLectureTimes2,'h:mm a');
		var newCourseLectureTimes = $scope.newCourseLectureTimes1 + " " + time;

		var newCourse = {
			"ID":$scope.newCourseID,
			"Name":$scope.newCourseName,
			"Overview":$scope.newCourseOverview,
			"Year":$scope.newCourseYear,
			"Trimester":$scope.newCourseTrimester,
			"LectureTimes":newCourseLectureTimes,
			"LecturerID":$scope.newCourseLecturerID,
		}
		$scope.coursedata.push(newCourse);

		for (var i = 0; i < $scope.coursedata.length; i++) {
			if ($scope.coursedata[i].ID == $scope.newCourseID 
				&& $scope.coursedata[i].Name == $scope.newCourseName 
				&& $scope.coursedata[i].Overview == $scope.newCourseOverview
				&& $scope.coursedata[i].Year == $scope.newCourseYear
				&& $scope.coursedata[i].Trimester == $scope.newCourseTrimester
				&& $scope.coursedata[i].LectureTimes == newCourseLectureTimes
				&& $scope.coursedata[i].LecturerID == $scope.newCourseLecturerID) {
				$scope.addCourseFeedback = "Successfully added new course.";
	}
		}

		// change this with http error
		if ($scope.addCourseFeedback != "Successfully added new course.") {
			$scope.addCourseFeedback = "Error! Something went wrong :( Try again later.";
		}
	};

	// Reset add new course form
	$scope.resetCourseForm = function() {
		$scope.addCourseForm = true;
		$scope.addedCourse = false;

		// clear all inputs
		$scope.newCourseID = "";
		$scope.newCourseName = "";
		$scope.newCourseOverview = "";
		$scope.newCourseYear = "";
		$scope.newCourseTrimester = "";
		$scope.newCourseLectureTimes1 = "";
		$scope.newCourseLectureTimes2 = "";
		$scope.newCourseLecturerID = "";
	};
}]);
