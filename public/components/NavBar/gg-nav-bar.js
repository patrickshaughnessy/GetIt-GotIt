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
      scope.isTeacherClassroom = $state.current.name === 'teacher-classroom';
      scope.isTeacherStats = $state.current.name === 'teacher-stats';
      scope.isStudentClassroom = $state.current.name === 'student-classroom';
      scope.isChatroomHelpee = $state.current.name === 'chatroom-helpee';
      scope.isChatroomHelper = $state.current.name === 'chatroom-helper';
      scope.navBarMargin = (scope.isProfile || scope.isTeacherStats) ? {} : {'margin-bottom':'0'};
    }
  }
});
