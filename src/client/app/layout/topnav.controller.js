(function() {
  'use strict';

  angular
  .module('app')
  .controller('TopNavController', TopNavController);

  // TopNav.$inject = [];

  /* @ngInject */
  function TopNavController() {
    var vm = this;

    activate();

    function activate() {
      console.log('topnav activated')
    }
  }
})();
