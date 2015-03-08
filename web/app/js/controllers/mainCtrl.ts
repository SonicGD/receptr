var mainCtrl = recptr.controller('mainCtrl', function ($scope, $rootScope, $location) {
    $scope.openRecipe = function (recipe) {
        $location.path('/recipes/' + recipe.id);
    }
});
