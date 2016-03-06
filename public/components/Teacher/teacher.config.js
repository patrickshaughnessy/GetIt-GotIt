angular
  .module("app")
  .config(function($stateProvider) {
    $stateProvider
      .state('teacher', {
        url: "/teacher",
        templateUrl: "partials/teacher.html",
        controller: "teacherCtrl",
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$waitForAuth();
          }]
        }
      })
  });
