'use strict';

angular
  .module('app')
  .service("DataService", ["$http", function($http) {
      this.save = function(data){
        return $http.post('http://localhost:8080/class/save', data);
      }
    }
  ]);
