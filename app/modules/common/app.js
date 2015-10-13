'use strict';

angular.module('druid', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngStorage',
    'restangular',
    'ui.bootstrap',
    'druid.query',
  ]
);

angular.module('druid').config(function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
});

angular.module('druid').controller('navigationController', ['$scope', '$location', function($scope, $location) {
  $scope.isActive = activeElement;

  function activeElement(path) {
    var url = $location.path();
    return ((url.includes(path) && path != '/') || (path == '/' && url == '/'));
  }

}]);
