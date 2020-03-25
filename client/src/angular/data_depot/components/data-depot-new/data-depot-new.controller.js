class DataDepotNewCtrl {
    constructor(
        $scope,
        $state,
        $uibModal,
        DataBrowserService,
        UserService
    ) {
        'ngInject';
        this.$scope = $scope;
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.DataBrowserService = DataBrowserService;
        this.UserService = UserService;
    }

    $onInit() {
        this.test = {
            enabled: (this.UserService.currentUser.oauth && true) || false,
            createFiles: false,
            createProject: (this.UserService.currentUser.oauth && true) || false,
        };

        this.$scope.$watch(() => this.DataBrowserService.currentState.listing, () => {
            this.test.createFiles = false;
            if (this.DataBrowserService.currentState.listing) {
                this.DataBrowserService.currentState.listing.listPermissions().then( (res) => {
                    this.res = res
                    let pems = res.response;
                    this.test.createFiles = pems.find(pem => {
                        return pem.username == this.UserService.currentUser.username;
                    }).permission.write;
                });
            }
        });
    }

    createFolder($event) {
        if (this.test.createFiles) {
            this.DataBrowserService.mkdir();
        } else {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    createProject($event) {
        $event.preventDefault();
        $event.stopPropagation();
        if (!this.test.createProject) {
            return;
        }
        const modal = this.$uibModal.open({
            component: 'newProjectModal',
        });
        modal.result.then(
            (res) => {
                this.$state.go(
                    'wb.data_depot.projects.listing',
                    {
                        systemId: res.project.id,
                        filePath: '/',
                        projectTitle: res.project.description,
                    }
                );
            }
        );
    }

    uploadFiles($event) {
        if (this.test.createFiles) {
            this.DataBrowserService.upload(false);
        } else {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }

    uploadFolders($event) {
        if (this.test.createFiles) {
            this.DataBrowserService.upload(true);
        } else {
            $event.preventDefault();
            $event.stopPropagation();
        }
    }
}

export default DataDepotNewCtrl;
