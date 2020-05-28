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
		$scope.invalidCredentials = false;
	}

	// Accordion in My Courses Section
	for (var i = 0; i < 4; i++) {
		$scope["accordion" + i] = false;
	}
	$scope.accordionFunction = function(index) {
		$scope["accordion" + index] = !$scope["accordion" + index];
	}

	// ----- ASSIGNMENT ------

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
		var date = $filter('date')($scope.newAssignmentDueDate1,'yyyy-MM-dd');
		var time = $filter('date')($scope.newAssignmentDueDate2,'hh:mm:ss');
		var newAssignmentDueDate = date + "T" + time;
		
		var newAssignment = JSON.stringify({
			ID:$scope.assignmentdata.length+1,
			Name:$scope.newAssignmentName,
			Overview:$scope.newAssignmentOverview,
			CourseID:$scope.newAssignmentCourseID,
			DueDate:newAssignmentDueDate,
		});

		$http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.assignment_directory.json", newAssignment)
		.then(function successCall(response) {
			$scope.addAssgnForm = false;
			$scope.addedAssgn = true;
			$scope.addAssgnFeedback = "Successfully added new assignment.";
		}), function errorCall(response) {
			$scope.addAssgnForm = false;
			$scope.addedAssgn = true;
			$scope.addAssgnFeedback = "Error! Something went wrong :( Try again later.";
		};
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

	$scope.openModifyAssgn = function(index) {
		dueDate = $scope.assignmentdata[index].DueDate
		var date = dueDate.substr(0, dueDate.indexOf('T'));
		var time = dueDate.substr(dueDate.indexOf('T')+1);

		$scope.modifyAssignmentID = $scope.assignmentdata[index].ID;
		$scope.modifyAssignmentName = $scope.assignmentdata[index].Name;
		$scope.modifyAssignmentOverview = $scope.assignmentdata[index].Overview;
		$scope.modifyAssignmentCourseID = $scope.assignmentdata[index].CourseID;
		$scope.modifyAssignmentDueDate1 = date;
		$scope.modifyAssignmentDueDate2 = time;
	};

	$scope.modifyAssgnForm = true;
	$scope.addModifiedAssgn = function() {
		var date = $filter('date')($scope.modifyAssignmentDueDate1,'yyyy-MM-dd');
		var time = $filter('date')($scope.modifyAssignmentDueDate2,'hh:mm:ss');
		var dueDate = date + "T" + time;

		var assignment = JSON.stringify({
			ID:$scope.modifyAssignmentID,
			Name:$scope.modifyAssignmentName,
			Overview:$scope.modifyAssignmentOverview,
			CourseID:$scope.modifyAssignmentCourseID,
			DueDate:dueDate,
		});

		$http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.assignment_directory.json", assignment)
		.then(function successCall(response) {
			$scope.modifyAssgnForm = false;
			$scope.modifiedAssgn = true;
			$scope.addCourseFeedback = "Successfully modified assignment.";
		}), function errorCall(response) {
			$scope.modifyAssgnForm = false;
			$scope.modifiedAssgn = true;
			$scope.addCourseFeedback = "Error! Something went wrong :( Try again later.";
		};
	};

	// $scope.deleteAssgnPopup = false;
	// $scope.deleteAssgnFeedbackPopup = false;
	// $scope.openDeleteAssgn = function($index) {
	// 	$scope.deleteAssgnPopup = true;
	// 	$scope.deleteAssignment = assignmentdata[index].Name;
	// }

	// $scope.deleteAssgn = function(index) {
	// 	var assignment = JSON.stringify({
	// 		ID:$scope.assignmentdata[index].ID,
	// 		Name:$scope.assignmentdata[index].Name,
	// 		Overview:$scope.assignmentdata[index].Overview,
	// 		CourseID:$scope.assignmentdata[index].CourseID,
	// 		DueDate:$scope.assignmentdata[index].DueDate,
	// 	});

	// 	$http.delete("https://caab.sim.vuw.ac.nz/api/thompsjord/delete.assignment." + $scope.assignmentdata[index].ID + ".json", assignment)
	// 	.then(function successCall(response) {
	// 		$scope.deleteCourseFeedback = "Successfully modified course.";
	// 	}), function errorCall(response) {
	// 		$scope.deleteCourseFeedback = "Error! Something went wrong :( Try again later.";
	// 	};

	// 	$scope.deleteAssgnPopup = false;
	// 	$scope.deleteAssgnFeedbackPopup = true;
	// }

	// ----- COURSE ------

	// Add new course
	$scope.addCourseForm = true;
	$scope.addNewCourse = function() {
		var time = $filter('date')($scope.newCourseLectureTimes2,'h:mm a');
		var lectureTimes = $scope.newCourseLectureTimes1 + " " + time;

		var newCourse = JSON.stringify({
			ID:$scope.newCourseID,
			Name:$scope.newCourseName,
			Overview:$scope.newCourseOverview,
			Year:$scope.newCourseYear,
			Trimester:$scope.newCourseTrimester,
			LectureTimes:lectureTimes,
			LecturerID:$scope.newCourseLecturerID,
		});

		$http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.course_directory.json", newCourse)
		.then(function successCall(response) {
			$scope.addCourseForm = false;
			$scope.addedCourse = true;
			$scope.modifyAssgnFeedback = "Successfully added new course.";
		}), function errorCall(response) {
			$scope.addCourseForm = false;
			$scope.addedCourse = true;
			$scope.modifyAssgnFeedback = "Error! Something went wrong :( Try again later.";
		};
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

	$scope.openModifyCourse = function(index) {
		lectureTimes = $scope.coursedata[index].LectureTimes
		var date = lectureTimes.substr(0, lectureTimes.indexOf(' '));
		var time = lectureTimes.substr(lectureTimes.indexOf(' ')+1);

		$scope.modifyCourseID = $scope.coursedata[index].ID;
		$scope.modifyCourseName = $scope.coursedata[index].Name;
		$scope.modifyCourseOverview = $scope.coursedata[index].Overview;
		$scope.modifyCourseYear = $scope.coursedata[index].Year;
		$scope.modifyCourseTrimester = $scope.coursedata[index].Trimester;
		$scope.modifyCourseLectureTimes1 = date;
		$scope.modifyCourseLectureTimes2 = time;
		$scope.modifyCourseLecturerID = $scope.coursedata[index].LecturerID;
	};

	$scope.modifyCourseForm = true;
	$scope.addModifiedCourse = function() {
		var time = $filter('date')($scope.modifyCourseLectureTimes2,'h:mm a');
		var lectureTimes = $scope.modifyCourseLectureTimes1 + " " + time;

		var course = JSON.stringify({
			ID:$scope.modifyCourseID,
			Name:$scope.modifyCourseName,
			Overview:$scope.modifyCourseOverview,
			Year:$scope.modifyCourseYear,
			Trimester:$scope.modifyCourseTrimester,
			LectureTimes:lectureTimes,
			LecturerID:$scope.modifyCourseLecturerID,
		});

		$http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.course_directory.json", course)
		.then(function successCall(response) {
			$scope.modifyCourseForm = false;
			$scope.modifiedCourse = true;
			$scope.modifyCourseFeedback = "Successfully modified course.";
		}), function errorCall(response) {
			$scope.modifyCourseForm = false;
			$scope.modifiedCourse = true;
			$scope.modifyCourseFeedback = "Error! Something went wrong :( Try again later.";
		};
	};
}]);
