import angular from 'angular';

import * as schemaForm from 'angular-schema-form';
import * as ngMaterial from 'angular-material';
import * as ngMessages from 'angular-messages';
import * as ui_bootstrap from 'angular-ui-bootstrap';
import * as ui_router from 'angular-ui-router';
import * as ngWebSocket from 'angular-websocket';
import * as ngSanitize from 'angular-sanitize';
import * as ngStorage from 'ng-storage';
import * as ngCookies from 'angular-cookies';
import * as ngAria from 'angular-aria';
import * as ngTranslate from 'angular-translate';
import * as xeditable from 'angular-xeditable';
import * as dndLists from 'angular-drag-and-drop-lists';
import * as ngAnimate from 'angular-animate';

import {mod as directives} from './ng-designsafe-directives';
import {mod as filters} from './ng-designsafe-filters';
import {mod as ng_modernizer} from './ng-modernizr';
import {mod as workspace} from './workspace';
import {mod as data_depot} from './data_depot';
import {mod as search} from './search';
import {mod as dashboard} from './dashboard';
import {mod as workbench} from './workbench';



function config($httpProvider, $locationProvider, $urlRouterProvider, $stateProvider) {
 'ngInject';
 $locationProvider.html5Mode({ enabled: true, requireBase: true, rewriteLinks: false});
 // $urlMatcherFactoryProvider.strictMode(false);
 $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
 $httpProvider.defaults.xsrfCookieName = 'csrftoken';
 $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

 $urlRouterProvider.otherwise('/workbench/dashboard');

// TODO: replace all these templateUrls

 $stateProvider
  .state('wb', {
    url: '/workbench',
    templateUrl: '/static/src/angular/workbench/templates/home.html',
    controller: 'WorkbenchCtrl',
    controllerAs: 'vm',
    abstract: true,
    resolve: {
      'systems': ['SystemsService', function(SystemsService) {
        return SystemsService.listing();
      }]
    }
  })
  .state('wb.dashboard', {
    'url': '/dashboard',
    'templateUrl': '/static/src/angular/workbench/templates/dashboard.html',
    'controller': 'DashboardCtrl',
    'resolve': {
      'test': function () {console.log("dashboard resolve");}
    }
  })
  .state('wb.data_depot', {
    'url': '/data-depot',
    'templateUrl': '/static/src/angular/workbench/templates/data-depot.html',
    'controller': 'DataDepotCtrl',
    'resolve': {
      'test': function () {console.log("data-depot resolve");},
      // 'systems': ['SystemsService', function(SystemsService) {
      //   return SystemsService.listing();
      // }]
    }
  })
  .state('wb.workspace', {
    'url': '/workspace',
    'templateUrl': '/static/src/angular/workbench/templates/workspace.html',
    'resolve': {
      'test': function () {console.log("workspace resolve");}
    }
  })
  .state('wb.help', {
    'url': '/help',
    'templateUrl': '/static/src/angular/workbench/templates/help.html',
    'resolve': {
      'test': function () {console.log("help resolve");}
    }
  })
  .state('wb.search', {
    'url': '/search',
    'templateUrl': '/static/src/angular/workbench/templates/search.html',
    'resolve': {
      'test': function () {console.log("search resolve");}
    }
  });
}

let mod = angular.module('portal', [
  'ngCookies',
  'ngAria',
  'ngAnimate',
  'ui.bootstrap',
  'ui.router',
  'schemaForm',
  'dndLists',
  'xeditable',
  'pascalprecht.translate',
  'ngStorage',
  'ngSanitize',
  'ngWebSocket',
  'ngMaterial',
  'ng.modernizr',
  'django.context',
  'portal.directives',
  'portal.filters',
  'portal.workspace',
  'portal.data_depot',
  'portal.search',
  'portal.dashboard',
  'portal.workbench',
]).config(config);

export default mod;
