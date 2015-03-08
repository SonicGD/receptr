/// <reference path="../../typings/tsd.d.ts" />
var apiUrl = '//'+location.hostname+':3000';
// Declare app level module which depends on views, and components
var recptr = angular.module('recptr', [
    'ngRoute', 'ngMaterial', 'ngResource', 'naif.base64', 'ngMdIcons'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', buildWhen('index'))
            .when('/recipes', buildWhen('recipeForm', 'recipeCtrl'))
            .when('/recipes/:id', buildWhen('recipe', 'recipeCtrl'))
            .when('/recipes/:id/edit', buildWhen('recipeForm', 'recipeCtrl'))
    }]);

var buildWhen = function (templateUrl, controllerName = null) {
    return {
        templateUrl: '/html/' + templateUrl + '.html',
        controller: controllerName ? controllerName : 'mainCtrl'
    };
};

recptr.factory('Resource', ['$resource', '$rootScope', '$location', function ($resource, $rootScope, $location) {
    return function (url, params, methods) {
        var defaults = {
            update: {method: 'put', isArray: false},
            create: {method: 'post'}
        };

        methods = angular.extend(defaults, methods);

        var resource = $resource(url, params, methods);

        resource.prototype.$save = function () {
            if (!this.id) {
                return this.$create(function(){
                $rootScope.loadData();
                $location.path('/');
                });
            }
            else {
                return this.$update(function (data) {
                    $rootScope.loadData();
                });
            }
        };

        return resource;
    };
}]);

recptr.factory('Recipe', ['Resource', function ($resource) {
    return $resource(apiUrl + "/recipes/:id", {id: '@id'});
}]);

recptr.config(['$locationProvider', function ($locationProvider) {
    $locationProvider
        .html5Mode(true)
        .hashPrefix('!');
}]);

recptr.run(function ($rootScope, Recipe, $location) {
    $rootScope.loadData = function () {
        Recipe.query(function (data) {
            $rootScope.recipes = data;
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

    $rootScope.loadData();
});