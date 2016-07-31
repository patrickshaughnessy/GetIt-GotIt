// (function() {
//   'use strict';
//
//   angular
//     .module('blocks.logger')
//     .factory('logger', logger);
//
//   logger.$inject = ['$log', 'toaster'];
//
//   /* @ngInject */
//   function logger($log, toaster) {
//     var service = {
//       showToasts: true,
//
//       error: error,
//       info: info,
//       success: success,
//       warning: warning,
//
//       // straight to console; bypass toaster
//       log: $log.log
//     };
//
//     return service;
//     /////////////////////
//
//     function error(message, data, title) {
//       toaster.error(message, title);
//       $log.error('Error: ' + message, data);
//     }
//
//     function info(message, data, title) {
//       toaster.info(message, title);
//       $log.info('Info: ' + message, data);
//     }
//
//     function success(message, data, title) {
//       toaster.success(message, title);
//       $log.info('Success: ' + message, data);
//     }
//
//     function warning(message, data, title) {
//       toaster.warning(message, title);
//       $log.warn('Warning: ' + message, data);
//     }
//   }
// } ());
