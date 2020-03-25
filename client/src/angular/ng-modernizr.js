import angular from 'angular';
let mod = angular.module('ng.modernizr', []);
mod.provider('Modernizr', function() {
  this.$get = function() {
    return window.Modernizr || {};
  };
});

export default mod;
