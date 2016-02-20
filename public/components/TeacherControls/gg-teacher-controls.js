angular.module('app')
.directive('ggTeacherControls', function(Auth, $state){

  return {
    templateUrl: 'partials/gg-teacher-controls.html',
    replace: true,
    // transclude: true,
    restrict: 'EA',
    link: function(scope, elem, attrs){
      
    }
  }
});
