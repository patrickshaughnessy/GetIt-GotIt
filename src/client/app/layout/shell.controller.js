(function() {
  'use strict';

  angular
  .module('app')
  .controller('ShellController', ShellController);

  ShellController.$inject = [];

  /* @ngInject */
  function ShellController() {
    var vm = this;

    activate();

    function activate() {
      console.log('shell activated');
    }
  }
})();
