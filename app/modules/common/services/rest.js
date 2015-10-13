'use strict';

angular.module('druid.config.services.druidAPI', []).factory('druidApi', ["$sessionStorage", "Restangular", function($sessionStorage, restangular) {
  return restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setFullResponse(true);
    RestangularConfigurer.setBaseUrl('http://localhost:5081');
  });
}]);
