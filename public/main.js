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
        url: "/teacher-classroom",
        templateUrl: "partials/teacher-classroom.html",
        controller: "teacherCtrl"
      })
      .state('student-classroom', {
        url: "/student-classroom/:id",
        templateUrl: "partials/student-classroom.html",
        controller: "studentCtrl"
      })
      .state('chatroom-helpee', {
        url: "/chatroom-helpee/:id",
        templateUrl: "partials/chatroom-helpee.html",
        controller: "chatroomCtrl"
      })
      .state('chatroom-helper', {
        url: "/chatroom-helper/:id",
        templateUrl: "partials/chatroom-helper.html",
        controller: "chatroomCtrl"
      })

  });
