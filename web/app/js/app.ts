/// <reference path="../../typings/tsd.d.ts" />
var apiUrl = '//' + location.hostname + ':3000';
// Declare app level module which depends on views, and components

var buildWhen = function (templateUrl, controllerName = null) {
    return {
        templateUrl: '/html/' + templateUrl + '.html',
        controller: controllerName ? controllerName : 'mainCtrl'
    };
};

interface IReceptrRootScope extends ng.IRootScopeService {
    loadData(callback:Function);
    getRandom();
    showFileDialog();
    recipes:IRecipe[]
}

module receptr {
    export class Module {
        app:ng.IModule;

        constructor(name:string, modules:Array< string >) {
            this.app = angular.module(name, modules);
        }

        addController(name:string, controller:Function) {
            this.app.controller(name, controller);
        }

        config(conf:any) {
            this.app.config(conf);
        }

        run(run:any) {
            this.app.run(run);
        }

        factory(name:string, factory:any) {
            this.app.factory(name, factory);
        }
    }
}

module receptrApp {
    var myApp = new receptr.Module('receptrApp', ['ngRoute', 'ngMaterial', 'ngResource', 'naif.base64', 'ngMdIcons']);
    myApp.addController('mainCtrl', mainCtrl);
    myApp.addController('recipeCtrl', recipeCtrl);
    myApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', buildWhen('index'))
            .when('/recipes', buildWhen('recipeForm', 'recipeCtrl'))
            .when('/recipes/:id', buildWhen('recipe', 'recipeCtrl'))
            .when('/recipes/:id/edit', buildWhen('recipeForm', 'recipeCtrl'))
    }]);
    myApp.config(['$locationProvider', function ($locationProvider) {
        $locationProvider
            .html5Mode(true)
            .hashPrefix('!');
    }]);
    myApp.run(function ($rootScope, Recipe:IRecipeResource, $location:ng.ILocationService, $timeout:ng.ITimeoutService) {

        $rootScope.loadData = function (callback:Function) {
            var recipes = Recipe.query();
            $rootScope.recipes = {};
            recipes.$promise.then(function () {
                for (var key in recipes) {
                    if (!recipes.hasOwnProperty(key) || recipes[key].id == undefined)continue;
                    $rootScope.recipes[recipes[key].id] = recipes[key];
                }
                callback();
            });
        };

        $rootScope.getRandom = function () {
            var recipe = $rootScope.recipes[Math.floor(Math.random() * $rootScope.recipes.length)];
            $location.path('/recipes/' + recipe.id);
        };

        $rootScope.showFileDialog = function (inputName) {
            console.log(inputName);
            document.getElementById(inputName).click();
        };

        $rootScope.loadData(function(){});
    });

    myApp.factory('Resource',
        ($resource:ng.resource.IResourceService, $rootScope:IReceptrRootScope):ng.resource.IResourceService => {

            return function (url, params, methods) {
                var defaults = {
                    update: {method: 'put', isArray: false},
                    create: {method: 'post'}
                };

                methods = angular.extend(defaults, methods);

                var resource = $resource(url, params, methods);

                resource.prototype.$save = function (callback) {
                    if (!this.id) {
                        return this.$create(function () {
                        });
                    }
                    else {
                        return this.$update(callback);
                    }
                };

                return resource;
            };
        });

    myApp.factory('Recipe',
        ['Resource', ($resource:ng.resource.IResourceService):IRecipeResource => {

            return <IRecipeResource> $resource(apiUrl + "/recipes/:id", {id: '@id'});
        }]);
}



