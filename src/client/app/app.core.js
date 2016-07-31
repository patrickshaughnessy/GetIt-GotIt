(function() {
    'use strict';

    angular
        .module('app.core', [
          /* Angular modules */
          'ngAnimate',

          /* Helper modules */
          // 'blocks.exception',
          // 'blocks.logger',
          'blocks.router',

          /* 3rd-party modules */
          'ui.router',
          'smoothScroll'
          // 'ui.mask',
          // 'firebase',
          // 'naif.base64',
        ]);
})();
