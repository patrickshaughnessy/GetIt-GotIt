'use strict';

angular
  .module('app')
  .controller("splashCtrl", function(Auth, currentAuth, $state, $scope, $firebaseObject) {

    if (currentAuth){
      $state.go('student');
    }

      // add login route for admin

    var usersRef = new Firebase('https://ch-getitgotit.firebaseio.com/users')
    var users = $firebaseObject(usersRef);

    $scope.loginWithFacebook = function(){
      $scope.loggingIn = true;
      Auth.$authWithOAuthPopup("facebook").then(function(authData) {
        if (!users[authData.uid]){
          users[authData.uid] = {
            name: authData.facebook.displayName,
            avatar: authData.facebook.profileImageURL,
          }
          users.$save().then(function(){
            return enterClass(authData);
          });
        } else {
          return enterClass(authData);
        }
      }).catch(function(error){
        swal("Authentication Failed!", error, 'error');
        $scope.loggingIn = false;
      })
    }

    $scope.loginWithGithub = function(){
      $scope.loggingIn = true;
      Auth.$authWithOAuthPopup("github").then(function(authData) {
        if (!users[authData.uid]){
          users[authData.uid] = {
            name: authData.github.displayName,
            avatar: authData.github.profileImageURL,
          }
          users.$save().then(function(){
            return enterClass(authData);
          });
        } else {
          return enterClass(authData);
        }
      }).catch(function(error){
        swal("Authentication Failed!", error, 'error');
        $scope.loggingIn = false;
      })
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
        users[authData.uid].classroom = {
          static: true
        };
        $state.go('student');
      });
    }

  });
