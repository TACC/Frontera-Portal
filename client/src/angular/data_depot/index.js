import {mod as services} from './services';
import {mod as controllers} from './controllers';
import {mod as directives}from './directives';

let mod = angular.module('portal.data_depot', [
  'portal.data_depot.services',
  'portal.data_depot.controllers',
  'portal.data_depot.directives'
]);

function config($httpProvider, $locationProvider, $stateProvider, $qProvider, $urlRouterProvider, $urlMatcherFactoryProvider, Django) {
  'ngInject';
  $qProvider.errorOnUnhandledRejections(false);
  $stateProvider  
    /* Private */
    //.state(selection)
    .state('wb.data_depot.db', {
        url: '/{directory}/{systemId}/{filePath:any}',
        templateUrl: '/static/src/angular/data_depot/templates/agave-data-listing.html',
        controller: 'DataBrowserCtrl',
        // abstract: true,          // not sure what this does
        // template: '<ui-view/>',  // don't think we need this anymore...
        params: {
          systemId: {value: '', squash: true},  //squashing these to get rid of trailing slashes
          name: {value:'', squash: true},
          directory: {value:''}
        }
      }
    );

    // each state for data depot lives here...
    // we will remove all of these and combine them into one megacontroller
    
    // .state('wb.data_depot.db.myData', {
    //   url: '/agave/{systemId}/{filePath:any}/',
    //   controller: 'MyDataCtrl',
    //   templateUrl: '/static/src/angular/data_depot/templates/agave-data-listing.html',
    // })
    // .state('wb.data_depot.db.projects', {
    //   url: '/projects/',
    //   abstract: true,
    // })
    // .state('wb.data_depot.db.projects.list', {
    //   url: '',
    //   controller: 'ProjectListCtrl',
    //   templateUrl: '/static/src/angular/data_depot/templates/project-list.html',
    // })
    // .state('wb.data_depot.db.projects.listing', {
    //   url: '{systemId}/{filePath:any}',
    //   controller: 'ProjectListingCtrl',
    //   templateUrl: '/static/src/angular/data_depot/templates/agave-data-listing.html',
    // })
    // .state('wb.data_depot.db.communityData', {
    //   url: '/public/{systemId}/{filePath:any}',
    //   controller: 'CommunityDataCtrl',
    //   templateUrl: '/static/src/angular/data_depot/templates/agave-data-listing.html',
    //   params: {
    //     filePath: '/'
    //   },
    // })
    // .state('wb.data_depot.sharedData', {
    //   url: '/shared/{systemId}/{filePath:any}/',
    //   controller: 'SharedDataCtrl',
    //   templateUrl: '/static/src/angular/data-depot/templates/agave-shared-data-listing.html',
    //   params: {
    //     systemId: 'utportal.storage.default',
    //     filePath: '$SHARE'
    //   },
    //   resolve: {
    //     'listing': ['$stateParams', 'DataBrowserService', function($stateParams, DataBrowserService) {
    //       var systemId = $stateParams.systemId || 'utportal.storage.default';
    //       var filePath = $stateParams.filePath || '$SHARE/';

    //       DataBrowserService.apiParams.fileMgr = 'agave';
    //       DataBrowserService.apiParams.baseUrl = '/api/agave/files';
    //       DataBrowserService.apiParams.searchState = 'sharedDataSearch';
    //       return DataBrowserService.browse({system: systemId, path: filePath});
    //     }],
    //     'auth': function($q) {
    //       if (Django.context.authenticated) {
    //         return true;
    //       } else {
    //         return $q.reject({
    //           type: 'authn',
    //           context: Django.context
    //         });
    //       }
    //     }
    //   }
    // })

}

mod.config(config)
  .run(['$rootScope', '$location', '$state', 'Django', '$trace', function($rootScope, $location, $state, Django, $trace) {

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      if (error.type === 'authn') {
        var redirectUrl = $state.href(toState.name, toParams);
        window.location = '/login/?next=' + redirectUrl;
      }
    });
  }]);

export default mod;
