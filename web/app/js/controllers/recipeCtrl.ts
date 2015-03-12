interface recipeCtrlScope extends ng.IScope {
    recipe: IRecipe;
    save();
    deleteRecipe();
    addIngredient();
    removeIngredient(key:number);
    addStep();
    removeStep(key:number);
}

class recipeCtrl {
    constructor($scope:recipeCtrlScope,
                Recipe:IRecipeResource,
                $routeParams,
                $location,
                $rootScope:IReceptrRootScope) {
        if ($routeParams.id) {
            var recipe:IRecipe = $rootScope.recipes[$routeParams.id];
        }
        else {
            var recipe:IRecipe = new Recipe;
            recipe.Title = 'Новый рецепт';
            recipe.Description = 'Описание';
            recipe.Url = '';
            recipe.Picture = new Picture;
            recipe.TimeToCook = 0;
            recipe.Ingredients = [];
            recipe.Steps = [];
        }
        $scope.recipe = recipe;

        $scope.save = function () {
            $scope.recipe.$save().then(function () {
                if (!$rootScope.hasOwnProperty($scope.recipe.id)) {
                    $rootScope.loadData(function () {
                        $location.path('/recipes/' + $scope.recipe.id);
                    })
                }
                else {
                    $location.path('/recipes/' + $scope.recipe.id);
                }
            });
        };

        $scope.deleteRecipe = function () {
            Recipe.delete({id: $scope.recipe.id}, function () {
                delete $rootScope.recipes[$scope.recipe.id];
                $location.path('/');
            });
        };

        $scope.addIngredient = function () {
            $scope.recipe.Ingredients.push(new Ingredient())
        };

        $scope.removeIngredient = function (key) {
            $scope.recipe.Ingredients.splice(key, 1);
        };

        $scope.addStep = function () {
            $scope.recipe.Steps.push(new Step)
        };

        $scope.removeStep = function (key) {
            $scope.recipe.Steps.splice(key, 1);
        };
    }
}