angular
  .module("app")
  .config(function($stateProvider) {
    $stateProvider
      .state('splash', {
        url: "/",
        templateUrl: "partials/splash.html",
        controller: "splashCtrl",
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$waitForAuth();
          }]
        }
      })
  });
