'use strict';

angular.module('druid.query', [
    'druid.query.controller'
]);

angular.module('druid.query').config(['$routeProvider', function config($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'modules/query/views/main.html',
      controller: 'queryController'
    });
}]);
