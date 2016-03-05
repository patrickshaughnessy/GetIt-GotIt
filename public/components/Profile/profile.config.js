angular
  .module("app")
  .config(function($stateProvider) {
    $stateProvider
      .state('profile', {
        url: "/profile",
        templateUrl: "partials/profile.html",
        controller: "profileCtrl",
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }]
        }
      })
  });
