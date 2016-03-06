'use strict';

angular
  .module("app", ["firebase", "ui.router", 'ui.mask', 'naif.base64', 'ngAnimate', 'ngLodash'])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    // $httpProvider.defaults.useXDomain = true;
    //
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $urlRouterProvider.otherwise("/");

  })
  .run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $state.go("splash");
      }
    });
  }]);
