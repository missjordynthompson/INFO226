var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	$scope.showLogin = true;
	$scope.showDashboard = false;
	$scope.studentUser = false;
	$scope.lecturerUser = false;

	$scope.userCourseAssociations = [];
	$scope.userCourseAssociationsAssignments = [];
	var userID = '';
	var filteredCourses = [];

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

	// Get all course associations
	$scope.getcourseassc = "https://caab.sim.vuw.ac.nz/api/thompsjord/course_association_directory.json";
  	$http.get($scope.getcourseassc)
    .then(function successCall(response) {
		$scope.courseassociationdata = response.data.courseAssociations;
	});
	
	// Login Function
	$scope.checkCred = function () {
		if ($scope.username != null && $scope.password != null) {
			for (var i = 0; i < $scope.userdata.length; i++) {
				if ($scope.username == $scope.userdata[i].LoginName && $scope.password == $scope.userdata[i].Password) {
					$scope.invalidCredentials = false;
					userID = $scope.userdata[i].ID;
					
					$scope.showLogin = false;
					$scope.showDashboard = true;

					if ($scope.userdata[i].UserType == 'student') {
						$scope.type = 'student';
					} else if ($scope.userdata[i].UserType == 'lecturer') {
						$scope.type = 'lecturer';		
					}

					// Filters through the course association data and retrieves the courses the user is involved in
					for (var i = 0; i < $scope.courseassociationdata.length; i++) {
						if (userID == $scope.courseassociationdata[i].StudentID) {
							filteredCourses.push($scope.courseassociationdata[i].CourseID);
						}
					}

					// Retrieves all course data of all courses the user is involved in
					for (crs of $scope.coursedata) {
						if (filteredCourses.includes(crs.ID)) {
							$scope.userCourseAssociations.push(crs);
						}
					}

					// Retrieves all assignments from all courses the user is involved in
					for (asn of $scope.assignmentdata) {
						if (filteredCourses.includes(asn.CourseID)) {
							$scope.userCourseAssociationsAssignments.push(asn);
						}
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

		$scope.userCourseAssociations = [];
		$scope.userCourseAssociationsAssignments = [];
		userID = '';
		filteredCourses = [];
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

	// Modify assignment
	$scope.modifyAssgnForm = true;
	$scope.openModifyAssgn = function(index) {
		// resets everything
		$scope.modifyAssgnForm = true;
		$scope.modifiedAssgn = false;

		// clear all inputs
		$scope.modifyAssignmentID = '';
		$scope.modifyAssignmentName = '';
		$scope.modifyAssignmentOverview = '';
		$scope.modifyAssignmentCourseID = '';
		$scope.modifyAssignmentDueDate1 = '';
		$scope.modifyAssignmentDueDate2 = '';

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

	// Delete assignment
	var assgnIndex;
	$scope.deleteAssignmentForm = true;
	$scope.openDeleteAssignment = function(index) {
		// resets everything
		$scope.deleteAssignmentForm = true;
		$scope.deletedAssignment = false;

		$scope.deleteAssgnNameID = "ID: " + $scope.userCourseAssociationsAssignments[index].ID + " - " + $scope.userCourseAssociationsAssignments[index].Name;
		$scope.deleteAssgnCourseID = "Year: " + $scope.userCourseAssociationsAssignments[index].Year;
		$scope.deleteAssgnDueDate = "Due Date: " + $scope.userCourseAssociationsAssignments[index].DueDate;

		assgnIndex = index;
	};

	$scope.addDeletedAssgn = function(index) {
		// need to get database for lecturers saved courses
	};

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

	// Modify course
	$scope.openModifyCourse = function(index) {
		// resets everything
		$scope.modifyCourseForm = true;
		$scope.modifiedCourse = false;

		// clear all inputs
		$scope.modifyCourseID = '';
		$scope.modifyCourseName = '';
		$scope.modifyCourseOverview = '';
		$scope.modifyCourseYear = '';
		$scope.modifyCourseTrimester = '';
		$scope.modifyCourseLectureTimes1 = '';
		$scope.modifyCourseLectureTimes2 = '';
		$scope.modifyCourseLecturerID = '';

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

	// Add course from course directory to course associations (saved courses) - DOESN'T WORK
	$scope.addToSavedCourses = function(index) {
		var course = JSON.stringify({
			ID:$scope.userCourseAssociations[index].ID,
			Name:$scope.userCourseAssociations[index].Name,
			Overview:$scope.userCourseAssociations[index].Overview,
			Year:$scope.userCourseAssociations[index].Year,
			Trimester:$scope.userCourseAssociations[index].Trimester,
			LectureTimes:$scope.userCourseAssociations[index].LectureTimes,
			LecturerID:$scope.userCourseAssociations[index].LecturerID,
		});

		var courseAssociation = JSON.stringify({
			ID: $scope.courseassociationdata.length+1,
			StudentID: userID,
			CourseID:$scope.userCourseAssociations[index].ID
		});

		$http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.course_association_directory.json", courseAssociation)
		.then(function successCall(response) {
			$scope.userCourseAssociations.push(course);
		});
	};

	// Delete course
	var courseIndex;
	$scope.deleteCourseForm = true;
	$scope.openDeleteCourse = function(index) {
		// resets everything
		$scope.deleteCourseForm = true;
		$scope.deletedCourse = false;

		$scope.deleteCourseNameID = $scope.coursedata[index].ID + ": " + $scope.coursedata[index].Name;
		$scope.deleteCourseYear = "Year: " + $scope.coursedata[index].Year;
		$scope.deleteCourseTrimester = "Trimester: " + $scope.coursedata[index].Trimester;
		$scope.deleteCourseLectureTimes = "Lecture Times: " + $scope.coursedata[index].LectureTimes;
		$scope.deleteCourseLecturerID = "Lecturer ID: " + $scope.coursedata[index].LecturerID;

		courseIndex = index;
	};

	$scope.addDeletedCourse = function() {
		var course = JSON.stringify({
			ID:$scope.coursedata[courseIndex].ID,
			Name:$scope.coursedata[courseIndex].Name,
			Overview:$scope.coursedata[courseIndex].Overview,
			Year:$scope.coursedata[courseIndex].Year,
			Trimester:$scope.coursedata[courseIndex].Trimester,
			LectureTimes:$scope.coursedata[courseIndex].LectureTimes,
			LecturerID:$scope.coursedata[courseIndex].LecturerID,
		});

		$http.delete("https://caab.sim.vuw.ac.nz/api/thompsjord/delete.course."+ $scope.coursedata[courseIndex].ID + ".json", course)
		.then(function successCall(response) {
			$scope.deleteCourseForm = false;
			$scope.deletedCourse = true;
			$scope.deleteCourseFeedback = "Successfully deleted course.";
		}), function errorCall(response) {
			$scope.deleteCourseForm = false;
			$scope.deletedCourse = true;
			$scope.deleteCourseFeedback = "Error! Something went wrong :( Try again later.";
		};

		courseIndex = '';
	};

	// Delete course association
	var courseAsscIndex;
	$scope.deleteCourseAssociationForm = true;
	$scope.openDeleteCourseAssociation = function(index) {
		// resets everything
		$scope.deleteCourseAssociationForm = true;
		$scope.deletedCourseAssociation = false;

		$scope.deleteCourseNameID = $scope.coursedata[index].ID + ": " + $scope.coursedata[index].Name;
		$scope.deleteCourseYear = "Year: " + $scope.coursedata[index].Year;
		$scope.deleteCourseTrimester = "Trimester: " + $scope.coursedata[index].Trimester;
		$scope.deleteCourseLectureTimes = "Lecture Times: " + $scope.coursedata[index].LectureTimes;
		$scope.deleteCourseLecturerID = "Lecturer ID: " + $scope.coursedata[index].LecturerID;

		courseAsscIndex = index;
	};

	$scope.addDeletedCourseAssociation = function() {
		var courseAssociation = JSON.stringify({
			ID: $scope.courseassociationdata[courseAsscIndex].ID,
			StudentID: $scope.courseassociationdata[courseAsscIndex].StudentID,
			CourseID:$scope.userCourseAssociations[courseAsscIndex].ID
		});

		$http.delete("https://caab.sim.vuw.ac.nz/api/thompsjord/delete.course."+ $scope.courseassociationdata[courseAsscIndex].ID + ".json", courseAssociation)
		.then(function successCall(response) {
			$scope.deleteCourseAssociationForm = false;
			$scope.deletedCourseAssociation = true;
			$scope.deleteCourseAssociationFeedback = "Successfully deleted course.";
		}), function errorCall(response) {
			$scope.deleteCourseAssociationForm = false;
			$scope.deletedCourseAssociation = true;
			$scope.deleteCourseAssociationFeedback = "Error! Something went wrong :( Try again later.";
		};

		courseAsscIndex = '';
	};
}]);
