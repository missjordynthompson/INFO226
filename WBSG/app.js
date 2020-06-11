var app = angular.module('plunker', []);

app.controller('MainCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	$scope.showLogin = true;
	$scope.showDashboard = false;
	$scope.studentUser = false;
	$scope.lecturerUser = false;

	$scope.studentCourseAssociations = [];
	$scope.studentCourseAssociationsAssignments = [];
	$scope.lecturerCourseAssociations = [];
	$scope.lecturerCourseAssociationsAssignments = [];

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

					// var assign = {
					// 	ID:"2",
					// 	Name:"Assignment 1",
					// 	Overview:"Create a ",
					// 	CourseID:"INFO234",
					// 	DueDate:"2018-08-01T00:00:00"
					// }
					// $http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.assignment_directory.json", JSON.stringify(assign));

					// $http.delete("https://caab.sim.vuw.ac.nz/api/thompsjord/delete.assignment." + 3 + ".json", JSON.stringify({"ID":"3","Name":"Make a website","Overview":"Create a website with outdated software","CourseID":"INFO226","DueDate":"0001-01-01T00:00:00"}));

					if ($scope.userdata[i].UserType == 'student') {
						$scope.type = 'student';

						// Filters through the course association data and retrieves the courses the student is involved in
						for (var i = 0; i < $scope.courseassociationdata.length; i++) {
							if (userID == $scope.courseassociationdata[i].StudentID) {
								filteredCourses.push($scope.courseassociationdata[i].CourseID);
							}
						}

						// Retrieves all course data of all courses the student is involved in
						for (crs of $scope.coursedata) {
							if (filteredCourses.includes(crs.ID)) {
								$scope.studentCourseAssociations.push(crs);
							}
						}

						// Retrieves all assignments from all courses the student is involved in
						for (asn of $scope.assignmentdata) {
							if (filteredCourses.includes(asn.CourseID)) {
								$scope.studentCourseAssociationsAssignments.push(asn);
							}
						}
					} else if ($scope.userdata[i].UserType == 'lecturer') {
						$scope.type = 'lecturer';

						// filter through all courses and retrieves data of courses that the lecturer teaches
						for (var i = 0; i < $scope.coursedata.length; i++) {
							if (userID == $scope.coursedata[i].LecturerID) {
								$scope.lecturerCourseAssociations.push($scope.coursedata[i]);
							}
						}

						// Retrieves all assignments from all courses the lecturer teaches
						for (asn of $scope.assignmentdata) {
							for (crs of $scope.lecturerCourseAssociations) {
								if (crs.ID == asn.CourseID) {
									$scope.lecturerCourseAssociationsAssignments.push(asn);
								}
							}
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
	};

	// Navigation Bar Scroll
	window.onscroll = function () { myFunction(); };
	var header = document.getElementById("myHeader");
	var sticky = header.offsetHeight;
	function myFunction() {
		if (window.pageYOffset >= sticky / 2) {
			header.classList.add("sticky");
		} else {
			header.classList.remove("sticky");
		}
	}

	// User log out
	$scope.logout = function () {
		$scope.showLogin = true;
		$scope.showDashboard = false;
		$scope.invalidCredentials = false;

		$scope.studentCourseAssociations = [];
		$scope.studentCourseAssociationsAssignments = [];
		$scope.lecturerCourseAssociations = [];
		$scope.lecturerCourseAssociationsAssignments = [];

		userID = '';
		filteredCourses = [];
	};

	// Accordion in My Courses Section
	for (var i = 0; i < 4; i++) {
		$scope["accordion" + i] = false;
	}
	$scope.accordionFunction = function (index) {
		$scope["accordion" + index] = !$scope["accordion" + index];
	};

	// ----- ASSIGNMENT ------
	// Mark assignment as complete
	for (var i = 0; i < 4; i++) {
		$scope["markedAssgn" + i] = false;
	}
	$scope.markAssignment = function (index) {
		if ($scope["markedAssgn" + index] == false) {
			$scope["markedAssgn" + index] = true;
		} else {
			$scope["markedAssgn" + index] = false;
		}
	};

	// Add new assignment
	$scope.addAssgnForm = true;
	$scope.addNewAssgn = function () {
		var date = $filter('date')($scope.newAssignmentDueDate1, 'yyyy-MM-dd');
		var time = $filter('date')($scope.newAssignmentDueDate2, 'hh:mm:ss');
		var newAssignmentDueDate = date + "T" + time;

		var assignment = {
			ID: $scope.assignmentdata.length + 1,
			Name: $scope.newAssignmentName,
			Overview: $scope.newAssignmentOverview,
			CourseID: $scope.newAssignmentCourseID,
			DueDate: newAssignmentDueDate,
		};

		$http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.assignment_directory.json", JSON.stringify(assignment))
		.then(function successCall(response) {
			$scope.assignmentdata.push(assignment);
			$scope.lecturerCourseAssociationsAssignments.push(assignment);
			
			$scope.addAssgnForm = false;
			$scope.addedAssgn = true;
			$scope.addAssgnFeedback = "Successfully added new assignment.";
		}, function errorCall(response) {
			$scope.addAssgnForm = false;
			$scope.addedAssgn = true;
			$scope.addAssgnFeedback = "Error! Something went wrong :( Try again later.";
		});
	};

	// Reset add new assignment form
	$scope.resetAssgnForm = function () {
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
	var modifyAssgnIdx;
	$scope.modifyAssgnForm = true;
	$scope.openModifyAssgn = function (index) {
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

		dueDate = $scope.lecturerCourseAssociationsAssignments[index].DueDate;
		var modifyAssgnUIDate = dueDate.substr(0, dueDate.indexOf('T'));
		var modifyAssgnUITime = dueDate.substr(dueDate.indexOf('T') + 1);
		modifyAssgnUIDate = $filter('date')(modifyAssgnUIDate, 'dd/MM/yyyy');
		modifyAssgnUITime = $filter('date')(modifyAssgnUITime, 'h:mm a');

		$scope.modifyAssignmentID = $scope.lecturerCourseAssociationsAssignments[index].ID;
		$scope.modifyAssignmentName = $scope.lecturerCourseAssociationsAssignments[index].Name;
		$scope.modifyAssignmentOverview = $scope.lecturerCourseAssociationsAssignments[index].Overview;
		$scope.modifyAssignmentCourseID = $scope.lecturerCourseAssociationsAssignments[index].CourseID;
		$scope.modifyAssignmentDueDate1 = modifyAssgnUIDate;
		$scope.modifyAssignmentDueDate2 = modifyAssgnUITime;

		modifyAssgnIdx = index;
	};

	$scope.addModifiedAssgn = function () {
		var modifyAssgnDataDate = $filter('date')($scope.modifyAssignmentDueDate1, 'yyyy-MM-dd');
		var modifyAssgnDataTime = $filter('date')($scope.modifyAssignmentDueDate2, 'hh:mm:ss');
		var dueDate = modifyAssgnDataDate + "T" + modifyAssgnDataTime;

		var assignment = {
			ID: $scope.modifyAssignmentID,
			Name: $scope.modifyAssignmentName,
			Overview: $scope.modifyAssignmentOverview,
			CourseID: $scope.modifyAssignmentCourseID,
			DueDate: dueDate,
		};

		$http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.assignment_directory.json", JSON.stringify(assignment))
		.then(function successCall(response) {
			$scope.lecturerCourseAssociationsAssignments.splice(modifyAssgnIdx, 1);
			$scope.lecturerCourseAssociationsAssignments.push(assignment);
			
			$scope.modifyAssgnForm = false;
			$scope.modifiedAssgn = true;
			$scope.modifyAssgnFeedback = "Successfully modified assignment.";
		}), function errorCall(response) {
			$scope.modifyAssgnForm = false;
			$scope.modifiedAssgn = true;
			$scope.modifyAssgnFeedback = "Error! Something went wrong :( Try again later.";
		};

		modifyAssgnIdx = '';
	};

	// Delete assignment
	var assgnIndex;
	$scope.deleteAssignmentForm = true;
	$scope.openDeleteAssignment = function (index) {
		// resets everything
		$scope.deleteAssignmentForm = true;
		$scope.deleteAssignment = false;

		$scope.deleteAssgnNameID = "ID: " + $scope.lecturerCourseAssociationsAssignments[index].ID + " - " + $scope.lecturerCourseAssociationsAssignments[index].Name;

		dueDate = $scope.lecturerCourseAssociationsAssignments[index].DueDate;
		var deleteAssgnUIDate = dueDate.substr(0, dueDate.indexOf('T'));
		var deleteAssgnUITime = dueDate.substr(dueDate.indexOf('T') + 1);
		deleteAssgnUIDate = $filter('date')(deleteAssgnUIDate, 'EEEE, MMMM d, y');
		deleteAssgnUITime = $filter('date')(deleteAssgnUITime, 'h:mm a');
		$scope.deleteAssgnDueDate = "Due Date: " + deleteAssgnUIDate + " at " + deleteAssgnUITime;

		assgnIndex = index - (index-1);
	};

	$scope.addDeletedAssignment = function () {
		var index;
			for (assgndata of $scope.assignmentdata) {
				if ($scope.lecturerCourseAssociationsAssignments[assgnIndex].ID == assgndata.ID) {
					index = $scope.assignmentdata.indexOf(assgndata);
				}
			}

		$http.delete("https://caab.sim.vuw.ac.nz/api/thompsjord/delete.assignment." + $scope.assignmentdata[index].ID + ".json")
		.then(function successCall(response) {
			// remove from lecturerCourseAssociationsAssignments 
			$scope.lecturerCourseAssociationsAssignments.splice(assgnIndex, 1);

			$scope.deleteAssignmentForm = false;
			$scope.deleteAssignment = true;
			$scope.deleteAssignmentFeedback = "Successfully deleted assignment.";
		}, function errorCall(response) {
			$scope.deleteAssignmentForm = false;
			$scope.deleteAssignment = true;
			$scope.deleteAssignmentFeedback = "Error! Something went wrong :( Try again later.";
		});
	};

	// ----- COURSE ------
	// Add new course
	$scope.addCourseForm = true;
	$scope.addNewCourse = function () {
		var time = $filter('date')($scope.newCourseLectureTimes2, 'h:mma');
		var lectureTimes = $scope.newCourseLectureTimes1 + " " + time;

		var course = {
			ID: $scope.newCourseID,
			Name: $scope.newCourseName,
			Overview: $scope.newCourseOverview,
			Year: $scope.newCourseYear,
			Trimester: $scope.newCourseTrimester,
			LectureTimes: lectureTimes,
			LecturerID: $scope.newCourseLecturerID,
		};

		// if course already exists
		var crsExists = false;
		for (crs of $scope.coursedata) {
			if (crs.ID == $scope.newCourseID && crs.Year == $scope.newCourseYear) {
				$scope.addCourseForm = false;
				$scope.addedCourse = true;
				$scope.addCourseFeedback = "Course already exists.";
				crsExists = true;
			}
		}

		if (crsExists == false) {
			$http({
				method: "POST",
				url: "https://caab.sim.vuw.ac.nz/api/thompsjord/update.course_directory.json",
				data: JSON.stringify(course)
			}).then(function successCall(response) {
				$scope.lecturerCourseAssociations.push(course);
				$scope.coursedata.push(course);
				
				$scope.addCourseForm = false;
				$scope.addedCourse = true;
				$scope.addCourseFeedback = "Successfully added new course.";
			}, function errorCall(response) {
				$scope.addCourseForm = false;
				$scope.addedCourse = true;
				$scope.addCourseFeedback = "Error! Something went wrong :( Try again later.";
			});
		}
	};

	// Reset add new course form
	$scope.resetCourseForm = function () {
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

	// Add course from course directory to course associations (saved courses)
	$scope.addToSavedCourses = function (index) {
		if ($scope.type == 'student') {
			var newCourseAssociation = {
				ID: $scope.courseassociationdata.length + 1,
				StudentID: userID,
				CourseID: $scope.coursedata[index].ID
			};
			$http({
				method: 'POST',
				url: 'https://caab.sim.vuw.ac.nz/api/thompsjord/update.course_association_directory.json',
				data: JSON.stringify(newCourseAssociation)
			});

			$scope.studentCourseAssociations.push($scope.coursedata[index]);
		} else if ($scope.type == 'lecturer') {
			// check if course isn't already in saved courses
			var crsExists = false;
			for (crs of $scope.lecturerCourseAssociations) {
				if ($scope.coursedata[index].ID == crs.ID) {
					crsExists = true;
				}
			}

			if (crsExists == false) {
				$scope.lecturerCourseAssociations.push($scope.coursedata[index]);
			}
		}
	};

	// Modify course association
	var modifyCourseAssIdx;
	var modifyCourseIdx;
	$scope.openModifyCourseAssocation = function (courseAsscIndex) {
		for (crs of $scope.coursedata) {
			if ($scope.lecturerCourseAssociations[courseAsscIndex].ID == crs.ID) {
				var index = $scope.coursedata.indexOf(crs);
			}
		}

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

		lectureTimes = $scope.coursedata[index].LectureTimes;
		var date = lectureTimes.substr(0, lectureTimes.indexOf(' '));
		var time = lectureTimes.substr(lectureTimes.indexOf(' ') + 1);

		$scope.modifyCourseID = $scope.coursedata[index].ID;
		$scope.modifyCourseName = $scope.coursedata[index].Name;
		$scope.modifyCourseOverview = $scope.coursedata[index].Overview;
		$scope.modifyCourseYear = $scope.coursedata[index].Year;
		$scope.modifyCourseTrimester = $scope.coursedata[index].Trimester;
		$scope.modifyCourseLectureTimes1 = date;
		$scope.modifyCourseLectureTimes2 = time;
		$scope.modifyCourseLecturerID = $scope.coursedata[index].LecturerID;

		modifyCourseAssIdx = courseAsscIndex; // for lec course assc
		modifyCourseIdx = index; // for course data
	};

	// Modify course
	$scope.openModifyCourse = function (index) {
		for (crs of $scope.lecturerCourseAssociations) {
			if ($scope.coursedata[index].ID == crs.ID) {
				var idx = $scope.lecturerCourseAssociations.indexOf(crs);
			}
		}

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

		lectureTimes = $scope.coursedata[index].LectureTimes;
		var date = lectureTimes.substr(0, lectureTimes.indexOf(' '));
		var time = lectureTimes.substr(lectureTimes.indexOf(' ') + 1);

		$scope.modifyCourseID = $scope.coursedata[index].ID;
		$scope.modifyCourseName = $scope.coursedata[index].Name;
		$scope.modifyCourseOverview = $scope.coursedata[index].Overview;
		$scope.modifyCourseYear = $scope.coursedata[index].Year;
		$scope.modifyCourseTrimester = $scope.coursedata[index].Trimester;
		$scope.modifyCourseLectureTimes1 = date;
		$scope.modifyCourseLectureTimes2 = time;
		$scope.modifyCourseLecturerID = $scope.coursedata[index].LecturerID;

		modifyCourseAssIdx = idx; // for lec course assc
		modifyCourseIdx = index; // for course data
	};

	$scope.modifyCourseForm = true;
	$scope.addModifiedCourse = function () {
		var time = $filter('date')($scope.modifyCourseLectureTimes2, 'h:mm a');
		var lectureTimes = $scope.modifyCourseLectureTimes1 + " " + time;

		var course = {
			ID: $scope.modifyCourseID,
			Name: $scope.modifyCourseName,
			Overview: $scope.modifyCourseOverview,
			Year: $scope.modifyCourseYear,
			Trimester: $scope.modifyCourseTrimester,
			LectureTimes: lectureTimes,
			LecturerID: $scope.modifyCourseLecturerID,
		};

		$http.post("https://caab.sim.vuw.ac.nz/api/thompsjord/update.course_directory.json", JSON.stringify(course))
		.then(function successCall(response) {
			$scope.coursedata.splice(modifyCourseIdx, 1);
			$scope.coursedata.push(course);
			$scope.lecturerCourseAssociations.splice(modifyCourseAssIdx, 1);
			$scope.lecturerCourseAssociations.push(course);

			$scope.modifyCourseForm = false;
			$scope.modifiedCourse = true;
			$scope.modifyCourseFeedback = "Successfully modified course.";
		}), function errorCall(response) {
			$scope.modifyCourseForm = false;
			$scope.modifiedCourse = true;
			$scope.modifyCourseFeedback = "Error! Something went wrong :( Try again later.";
		};

		modifyCourseIndex = '';
		modifyCourseAsscIndex = '';
	};

	// Delete course
	var deleteCourseIdx;
	$scope.deleteCourseForm = true;
	$scope.openDeleteCourse = function (index) {
		// resets everything
		$scope.deleteCourseForm = true;
		$scope.deletedCourse = false;

		$scope.deleteCourseNameID = $scope.coursedata[index].ID + ": " + $scope.coursedata[index].Name;
		$scope.deleteCourseYear = "Year: " + $scope.coursedata[index].Year;
		$scope.deleteCourseTrimester = "Trimester: " + $scope.coursedata[index].Trimester;
		$scope.deleteCourseLectureTimes = "Lecture Times: " + $scope.coursedata[index].LectureTimes;
		$scope.deleteCourseLecturerID = "Lecturer ID: " + $scope.coursedata[index].LecturerID;

		deleteCourseIdx = index;
	};

	$scope.addDeletedCourse = function () {
		var deleteInx;
		// if course exists in saved courses
		for (crs of $scope.lecturerCourseAssociations) {
			if ($scope.coursedata[deleteCourseIdx].ID == crs.ID) {
				deleteInx = $scope.lecturerCourseAssociations.indexOf(crs);
			}
		}

		$http.delete("https://caab.sim.vuw.ac.nz/api/thompsjord/delete.course." + $scope.coursedata[deleteCourseIdx].ID + ".json")
		.then(function successCall(response) {
			// remove from coursedata
			$scope.coursedata.splice(deleteCourseIdx, 1)

			// if course exists in saved courses
			$scope.lecturerCourseAssociations.splice(deleteInx, 1);

			$scope.deleteCourseForm = false;
			$scope.deletedCourse = true;
			$scope.deleteCourseFeedback = "Successfully deleted course.";
		}), function errorCall(response) {
			$scope.deleteCourseForm = false;
			$scope.deletedCourse = true;
			$scope.deleteCourseFeedback = "Error! Something went wrong :( Try again later.";
		};

		// deleteCourseIdx = '';
	};

	// Delete course association
	var courseAsscIdx;
	var studentIdx; // index in courseassociationdata
	$scope.deleteCourseAssociationForm = true;
	$scope.openDeleteCourseAssociation = function (crsAscIndex) {
		// resets everything
		$scope.deleteCourseAssociationForm = true;
		$scope.deletedCourseAssociation = false;

		if ($scope.type == 'student') {
			$scope.deleteCourseNameID = $scope.studentCourseAssociations[crsAscIndex].ID + ": " + $scope.studentCourseAssociations[crsAscIndex].Name;
			$scope.deleteCourseYear = "Year: " + $scope.studentCourseAssociations[crsAscIndex].Year;
			$scope.deleteCourseTrimester = "Trimester: " + $scope.studentCourseAssociations[crsAscIndex].Trimester;
			$scope.deleteCourseLectureTimes = "Lecture Times: " + $scope.studentCourseAssociations[crsAscIndex].LectureTimes;
			$scope.deleteCourseLecturerID = "Lecturer ID: " + $scope.studentCourseAssociations[crsAscIndex].LecturerID;

			for (crs of $scope.courseassociationdata) {
				if ($scope.studentCourseAssociations[crsAscIndex].ID == crs.CourseID && userID == crs.StudentID) {
					studentIdx = $scope.courseassociationdata.indexOf(crs);
				}
			}
		} else if ($scope.type == 'lecturer') {
			$scope.deleteCourseNameID = $scope.lecturerCourseAssociations[crsAscIndex].ID + ": " + $scope.lecturerCourseAssociations[crsAscIndex].Name;
			$scope.deleteCourseYear = "Year: " + $scope.lecturerCourseAssociations[crsAscIndex].Year;
			$scope.deleteCourseTrimester = "Trimester: " + $scope.lecturerCourseAssociations[crsAscIndex].Trimester;
			$scope.deleteCourseLectureTimes = "Lecture Times: " + $scope.lecturerCourseAssociations[crsAscIndex].LectureTimes;
			$scope.deleteCourseLecturerID = "Lecturer ID: " + $scope.lecturerCourseAssociations[crsAscIndex].LecturerID;
		}

		courseAsscIdx = crsAscIndex;
	};

	$scope.addDeletedCourseAssociation = function () {
		if ($scope.type == 'lecturer') {
			$scope.lecturerCourseAssociations.splice(courseAsscIdx, 1);

			$scope.deleteCourseAssociationForm = false;
			$scope.deletedCourseAssociation = true;
			$scope.deleteCourseAssociationFeedback = "Successfully deleted course.";
		} else if ($scope.type == 'student') {
			$http.delete("https://caab.sim.vuw.ac.nz/api/thompsjord/delete.course_association." + $scope.courseassociationdata[studentIdx].ID + ".json")
			.then(function successCall(response) {
				// remove course from studentCourseAssociations
				$scope.studentCourseAssociations.splice(courseAsscIdx, 1);
				
				$scope.addDeletedAssignment;
				$scope.deleteCourseAssociationForm = false;
				$scope.deletedCourseAssociation = true;
				$scope.deleteCourseAssociationFeedback = "Successfully deleted course.";
			}), function errorCall(response) {
				$scope.deleteCourseAssociationForm = false;
				$scope.deletedCourseAssociation = true;
				$scope.deleteCourseAssociationFeedback = "Error! Something went wrong :( Try again later.";
			};

			studentIdx = '';
		}

		courseAsscIdx = '';
	};
}]);
