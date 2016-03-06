angular
  .module("app")
  .config(function($stateProvider) {
    $stateProvider
      .state('student', {
        url: "/student/:classID",
        templateUrl: "partials/student.html",
        controller: "studentCtrl",
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })
  });
