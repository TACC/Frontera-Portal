import _ from 'underscore';
import angular from 'angular';

function ApplicationFormCtrl($scope, $rootScope, $localStorage, $location, $anchorScroll, $translate, Apps, Jobs, SystemsService, Systems, Django) {
  "ngInject";
  $localStorage.systemChecks = {};

  $scope.data = {
    messages: [],
    submitting: false,
    needsLicense: false,
    app: null,
    form: {}
  };

  $scope.$on('launch-app', function(e, app) {
    $scope.error = '';

    if ($scope.data.app) {
      $rootScope.$broadcast('close-app', $scope.data.app.id);
    }

    $scope.data.type = app.value.type;
    if (app.value.type === 'agave'){
      Apps.get(app.value.definition.id).then(
        function(resp) {
          // Check if user has access to execSystem -- only necessary on tacc.prod tenant
          if ((new URL(resp.data.response._links.owner.href)).hostname == "api.tacc.utexas.edu") {
            Systems.getSystemRoles(resp.data.response.executionSystem)
              .then(function (response) {
                var userHasAccess = false;
                _.each(response.data.response, function (role) {
                  if (role.username === Django.user) {
                    userHasAccess = true;
                  }
                });

                if (!userHasAccess) {
                  Systems.updateRole(resp.data.response.executionSystem, 'USER');
                }
              });
          }
        // check app execution system
        // Systems.getMonitor(resp.data.response.executionSystem)
        //   .then(
        //     function(response){
        //       if (response.data.response.length > 0){
        //           // perform check only when monitor is active
        //           if (response.data[0].active){
        //             if (response.data[0].lastSuccess !== null){
        //               var currentDate = new Date();
        //               var monitorLastSuccessDate = Date.parse(response.data[0].lastSuccess);
        //               var diff = Math.abs((currentDate - monitorLastSuccessDate) / 60000);
        //
        //               if (diff > response.data[0].frequency){
        //                 toastr.warning($translate.instant('error_system_monitor'));
        //               }
        //             } else {
        //               toastr.warning($translate.instant('error_system_monitor'));
        //             }
        //         }
        //       }
        //     });

        $scope.data.app = resp.data.response;
        $scope.resetForm();
      });
    } else if (app.value.type === 'html'){
      $scope.data.app = app.value.definition.html;
      /* Can be enabled if non-agave, i.e. html apps, will use licensing */
      // Apps.getMeta(app.value.definition.id).then(
      //   function (resp) {
      //     $scope.data.app = resp.data.response.value.definition.html;
      //     $scope.data.needsLicense = resp.data.response.license.type && !resp.data.response.license.enabled;
      //   }
      // );
    }
  });

  $scope.resetForm = function() {
    $scope.data.needsLicense = $scope.data.app.license.type && !$scope.data.app.license.enabled;
    $scope.form = {model: {}, readonly: $scope.data.needsLicense};
    $scope.form.schema = Apps.formSchema($scope.data.app);
    $scope.form.form = [];

    /* inputs */
    var items = [];
    if ($scope.form.schema.properties.inputs) {
      items.push('inputs');
    }
    if ($scope.form.schema.properties.parameters) {
      items.push('parameters');
    }
    $scope.form.form.push({
      type: 'fieldset',
      readonly: $scope.data.needsLicense,
      title: 'Inputs',
      items: items
    });

    /* job details */
    items = [];
    if ($scope.data.app.tags.includes('Interactive')) {
      items.push('name');
    } else {
      items.push('maxRunTime', 'name', 'archivePath');
    }
    if ($scope.data.app.parallelism == "PARALLEL") {
      items.push('nodeCount');
    }
    $scope.form.form.push({
      type: 'fieldset',
      readonly: $scope.data.needsLicense,
      title: 'Job details',
      items: items
    });

    /* buttons */
    items = [];
    if (!$scope.data.needsLicense) {
      items.push({ type: 'submit', title: ($scope.data.app.tags.includes('Interactive') ? 'Launch' : 'Run'), style: 'btn-primary' });
    }
    items.push({type: 'button', title: 'Close', style: 'btn-link', onClick: 'closeApp()'});
    $scope.form.form.push({
      type: 'actions',
      items: items
    });
  };

  $scope.onSubmit = function(form) {    
    $scope.data.messages = [];
    $scope.$broadcast('schemaFormValidate');
    if (form.$valid) {
      var jobData = {
        appId: $scope.data.app.id,
        archive: true,
        inputs: {},
        parameters: {}
      };

      /* Add any attribute that requires an API call for the job to be ready to $scope.jobReady, e.g. notifications or project listings for VNC apps */
      $scope.jobReady = {
        notifications: false
      };

      Jobs.getWebhookUrl().then(function (resp) {
        jobData.notifications = ["PENDING", "QUEUED", "SUBMITTING", "PROCESSING_INPUTS", "STAGED", "RUNNING", "KILLED", "FAILED", "STOPPED", "FINISHED"].map(function (e) {
          return {
            url: resp.data,
            event: e
          };
        });
        $scope.jobReady.notifications = true;
      });

      /* copy form model to disconnect from $scope */
      _.extend(jobData, angular.copy($scope.form.model));

      /* move archivePath from inputs */
      if (jobData.inputs.hasOwnProperty('archivePath')) {
        jobData.archivePath = jobData.inputs.archivePath;
        delete jobData.inputs.archivePath;

      } else if (jobData.appId.includes('compress') || jobData.appId.includes('extract')) {
        /* Set archivePath to inputPath for compress and zip apps */
        var tmp_path = Object.values(jobData.inputs)[0].split('/');
        tmp_path.pop();
        jobData.archivePath = tmp_path.join('/');
      }

      /* remove falsy input/parameter */
      _.each(jobData.inputs, function(v,k) {
        if (_.isArray(v)) {
          v = _.compact(v);
          if (v.length === 0) {
            delete jobData.inputs[k];
          }
        }
      });
      _.each(jobData.parameters, function(v,k) {
        if (_.isArray(v)) {
          v = _.compact(v);
          if (v.length === 0) {
            delete jobData.parameters[k];
          }
        }
      });

      // Calculate processorsPerNode if nodeCount parameter submitted
      if (_.has(jobData, 'nodeCount')) {
        jobData.processorsPerNode = jobData.nodeCount * ($scope.data.app.defaultProcessorsPerNode / $scope.data.app.defaultNodeCount);
      }

      var unregister = $scope.$watchCollection('jobReady', function (params) {
        if (Object.values(params).every(Boolean)) {
          $scope.data.submitting = true;
          Jobs.submit(jobData).then(
            function (resp) {
              $scope.data.submitting = false;
              $rootScope.$broadcast('job-submitted', resp.data);
              $scope.data.messages.push({
                type: 'success',
                header: 'Job Submitted Successfully',
                body: 'Your job <em>' + resp.data.name + '</em> has been submitted. Monitor its status on the right.'
              });
              $scope.resetForm();
              refocus();
            }, function (err) {
              $scope.data.submitting = false;
              $scope.data.messages.push({
                type: 'danger',
                header: 'Job Submit Failed',
                body: 'Your job submission failed with the following message:<br>' +
                  '<em>' + (err.data.message || 'Unexpected error') + '</em><br>' +
                  'Please try again. If this problem persists, please ' +
                  '<a href="/help" target="_blank">submit a support ticket</a>.'
              });
              refocus();
            });
          unregister();
        }
      });
    }
  };

  function refocus() {
    $location.hash('workspace');
    $anchorScroll();
  }

  function closeApp() {
    $scope.data.app = null;
    $scope.data.appLicenseEnabled = false;
  }

  $scope.$on('close-app', closeApp);

  $scope.closeApp = function() {
    $rootScope.$broadcast('close-app', $scope.data.app.id);
    closeApp();
  };
}

export default ApplicationFormCtrl;
