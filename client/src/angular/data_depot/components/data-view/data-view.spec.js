describe('DataViewCtrl', ()=>{
    let controller, deferred, $scope, browsePromise;

    // Mock requirements.
    beforeEach(angular.mock.module("portal"));
    beforeEach( ()=> {
        angular.mock.inject((
            _$q_,
            _$rootScope_,
            _DataBrowserService_,
            _UserService_,
            _$state_,
            _$stateParams_,
            $componentController
        ) => {
            $scope = _$rootScope_.$new();
            deferred = _$q_.defer();
            browsePromise = _$q_.defer();
            const mockedServices = {
                $state: _$state_,
                $stateParams: {
                    systemId: '',
                    filePath: '/',
                    name: 'My Data',
                    directory: 'agave'
                },
                DataBrowserService: _DataBrowserService_,
                UserService: _UserService_
            };
            const mockedBindings = {};
            controller = $componentController(
                'dataViewComponent',
                mockedServices,
                mockedBindings
            );
            controller.$onInit();
        });
    });

    it('should initialize controller', () => {
        expect(controller.browser).toBeDefined();
    });
    it('should set apiParams correctly on init', () => {
        controller.$stateParams.name = 'My Data';
        controller.$stateParams.directory = 'agave';
        controller.$onInit();
        expect(controller.DataBrowserService.apiParams.fileMgr).toBe('my-data');
        expect(controller.DataBrowserService.apiParams.baseUrl).toBe('/api/data-depot/files');
        expect(controller.DataBrowserService.apiParams.searchState).toBe('wb.data_depot.db');
        expect(controller.breadcrumbParams.customRoot.name).toBe('My Data');

        controller.$stateParams.name = 'Community Data';
        controller.$stateParams.directory = 'public';
        controller.$onInit();
        expect(controller.DataBrowserService.apiParams.fileMgr).toBe('shared');
        expect(controller.DataBrowserService.apiParams.baseUrl).toBe('/api/data-depot/files');
        expect(controller.DataBrowserService.apiParams.searchState).toBe('wb.data_depot.db');
        expect(controller.breadcrumbParams.customRoot.name).toBe('Community Data');

    });
    it('should go to correct state when browsing', () => {
        spyOn(
            controller.$state,
            'go'
        );
        controller.onBrowse(
            {preventDefault: ()=>{return;},
            stopPropagation: ()=>{return;}},
            {system: 'mock.system', path:'path/to/dir', type:'dir'},
        );
        expect(controller.$state.go).toHaveBeenCalledWith(
            'wb.data_depot.db',
            {
                systemId: 'mock.system',
                filePath: 'path/to/dir',
            },
            {reload: true, inherit: false}
        );
    });

});
