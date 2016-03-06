angular
  .module("app")
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "partials/home.html",
        controller: "homeCtrl",
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })
  });
