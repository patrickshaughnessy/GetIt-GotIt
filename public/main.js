'use strict';

angular
  .module("app", ["firebase", "ui.router"])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('splash', {
        url: "/",
        templateUrl: "partials/splash.html",
        controller: "splashCtrl"
      })
      .state('home', {
        url: "/home",
        templateUrl: "partials/home.html",
        controller: "homeCtrl"
      })
      .state('teacher-classroom', {
        url: "/teacher-classroom/:classID",
        templateUrl: "partials/teacher-classroom.html",
        controller: "teacherCtrl"
      })
      .state('student-classroom', {
        url: "/student-classroom/:classID",
        templateUrl: "partials/student-classroom.html",
        controller: "studentCtrl"
      })
      .state('chatroom-helpee', {
        url: "/student-classroom/:classID/chatroom-helpee/:chatID",
        templateUrl: "partials/chatroom-helpee.html",
        controller: "chatroomHelpeeCtrl"
      })
      .state('chatroom-helper', {
        url: "/student-classroom/:classID/chatroom-helper/:chatID",
        templateUrl: "partials/chatroom-helper.html",
        controller: "chatroomHelperCtrl"
      })

  });
