'use strict';

angular
  .module('app')
  // .controller("chatroomCtrl", function($state, $scope, $firebaseObject) {
  //   var ref = new Firebase("https://getitgotit.firebaseio.com/data");
  //
  //   // download the data into a local object
  //   var syncObject = $firebaseObject(ref);
  //
  //   // synchronize the object with a three-way data binding
  //   // click on `index.html` above to see it used in the DOM!
  //   syncObject.$bindTo($scope, "data");
  //
  //
  // });

  .controller('chatroomCtrl', Shell);

  function Shell() {

    var vm = this;

    vm.messages = [
      {
        'username': 'username1',
        'content': 'Hi!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      },
      {
        'username': 'username2',
        'content': 'Hello!'
      }
    ];

    vm.username = 'username1';

    vm.sendMessage = function(message, username) {
      if(message && message !== '' && username) {
        vm.messages.push({
          'username': username,
          'content': message
        });
      }
    };
    vm.visible = true;
    vm.expandOnNew = true;
  }
