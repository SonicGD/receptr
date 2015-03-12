class mainCtrl {
    constructor($scope, $location) {
        $scope.openRecipe = function (recipe:IRecipe) {
            $location.path('/recipes/' + recipe.id);
        }
    }
}