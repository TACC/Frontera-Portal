import angular from 'angular';

function SimpleList($http, $q, appCategories) {
    'ngInject';
    let SimpleList = function() {
        this.selected = null;
        this.lists = {};
        this.map = {};
        this.tabs = appCategories.concat(['My Apps']);
        angular.forEach(this.tabs, (tab) => {
            this.lists[tab] = [];
        });
    };
    // TODO: There is no reason that these have to be prototypes.
    SimpleList.prototype.getPrivate = function() {
        let self = this;
        return $http({
            url: '/api/workspace/apps',
            method: 'GET',
            params: { private: 'true' },
        }).then((resp) => {
            // this munges the standard agave apps list into
            // something that looks like a metadata listing so that
            // the UI can handle it the same way
            let apps = resp.data.response,
                wrapped = apps.filter((d) => d.id.toLowerCase().startsWith('prtl.clone') === false)
                    .map((d) => {
                        return {
                            value: {
                                type: 'agave',
                                definition: d,
                            },
                        };
                    });
            self.lists['My Apps'] = wrapped;
        });
    };

    SimpleList.prototype.getDefaultLists = function() {
        let self = this,
            deferred = $q.defer();
        $http({
            url: '/api/workspace/meta',
            method: 'GET'
        }).then(
            (response) => {
                angular.forEach(response.data.response, function(appMeta) {

                    // If label is undefined, set as id
                    if (!appMeta.value.definition.label) {
                        appMeta.value.definition.label = appMeta.value.definition.id;
                    }
                    // Apply label for ordering
                    appMeta.value.definition.orderBy = appMeta.value.definition.label;

                    // Parse app icon
                    if (appMeta.value.definition.hasOwnProperty('tags') && appMeta.value.definition.tags.filter((s) => s.includes('appIcon')) !== undefined && appMeta.value.definition.tags.filter((s) => s.includes('appIcon')).length != 0) {
                        appMeta.value.definition.icon = appMeta.value.definition.tags.filter((s) => s.includes('appIcon'))[0].split(':')[1];
                    }

                    if (appMeta.value.definition.isPublic) {
                        // If App has no category, place in Simulation tab
                        // Check if category exists in a tag.
                        let appCategory = 'Simulation';
                        if (appMeta.value.definition.hasOwnProperty('tags') && appMeta.value.definition.tags.filter((s) => s.includes('appCategory')) !== undefined && appMeta.value.definition.tags.filter((s) => s.includes('appCategory')).length != 0) {
                            appCategory = appMeta.value.definition.tags.filter((s) => s.includes('appCategory'))[0].split(':')[1];
                        }
                        if (appCategory in self.lists) {
                            self.lists[appCategory].push(appMeta);
                        } else {
                            self.lists['Simulation'].push(appMeta);
                        }
                    } else {
                        self.lists['My Apps'].push(appMeta);
                    }
                });

                deferred.resolve(self);
            },
            (err) => {
                deferred.reject(err);
            }
        );
        return deferred.promise;
    };

    return SimpleList;
}

export default SimpleList;
