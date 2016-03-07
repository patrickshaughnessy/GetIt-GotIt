'use strict';

angular
  .module("app")
  .controller("mainCtrl", function(Auth, $scope, $firebaseObject, $firebaseArray) {

    $scope.currentAuth = Auth.$getAuth();


    var usersRef = new Firebase('https://ch-getitgotit.firebaseio.com/users')
    var users = $firebaseObject(usersRef);

    var ref = new Firebase("https://ch-getitgotit.firebaseio.com");

    $scope.loginWithFacebook = function(){
      $scope.loggingIn = true;
      ref.authWithOAuthToken("facebook", localStorage.accessToken, function(error, authData) {
        if (error) {
          swal("Authentication Failed!", error, 'error');
          $scope.loggingIn = false;
        } else {
          if (!users[authData.uid]){
            users[authData.uid] = {
              name: authData.facebook.displayName,
              avatar: authData.facebook.profileImageURL,
            }
            users.$save().then(function(){
              enterClass(authData);
            });
          } else {
            enterClass(authData);
          }
        }
      });
    }

    if (localStorage.accessToken){
      $scope.loginWithFacebook();
    }

    $scope.loginWithGithub = function(){
      $scope.loggingIn = true;
      ref.authWithOAuthToken("facebook", localStorage.accessToken, function(error, authData) {
        if (error) {
          swal("Authentication Failed!", error, 'error');
          $scope.loggingIn = false;
        } else {
          if (!users[authData.uid]){
            users[authData.uid] = {
              name: authData.facebook.displayName,
              avatar: authData.facebook.profileImageURL,
            }
            users.$save().then(function(){
              enterClass(authData);
            });
          } else {
            enterClass(authData);
          }
        }
      });
    }

    function enterClass(authData){
      var studentsRef = new Firebase(`https://ch-getitgotit.firebaseio.com/classrooms/static/students`);
      var students = $firebaseObject(studentsRef);
      students.$bindTo($scope, 'students').then(function(){
        var student = {
          name: users[authData.uid].name,
          avatar: users[authData.uid].avatar,
          color: 'gray'
        };
        $scope.students[authData.uid] = student;
      });
    }

  })
