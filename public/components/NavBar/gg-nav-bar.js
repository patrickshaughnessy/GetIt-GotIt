angular.module('app')
.directive('ggNavBar', function(Auth, $state){

  return {
    templateUrl: 'partials/gg-nav-bar.html',
    replace: true,
    transclude: true,
    restrict: 'EA',
    link: function(scope, elem, attrs){
      scope.isLoggedIn = Auth.$getAuth();
      scope.auth = Auth;

      scope.isHome = $state.current.name === 'home';
      scope.isProfile = $state.current.name === 'profile';
      scope.isTeacher = $state.current.name === 'teacher';
      scope.isStudent = $state.current.name === 'student';

      scope.navBarMargin = scope.isProfile ? {} : {'margin-bottom':'0'};
    }
  }
});
