angular
  .module("app")
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "partials/home.html",
        controller: "homeCtrl",
        resolve: {
          // controller will not be loaded until $requireAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["Auth", function(Auth) {
            // $requireAuth returns a promise so the resolve waits for it to complete
            // If the promise is rejected, it will throw a $stateChangeError (see above)
            return Auth.$requireAuth();
          }]
        }
      })
  });
