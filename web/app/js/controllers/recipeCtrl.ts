var recipeCtrl = recptr.controller('recipeCtrl', function ($scope, Recipe, $routeParams, $route, $timeout, $location) {
    if ($routeParams.id) {
        Recipe.get({id: $routeParams.id}, function (data) {
            $scope.recipe = data;
        });
    }
    else {
        $scope.recipe = new Recipe;
        $scope.recipe.Title = 'Новый рецепт';
        $scope.recipe.Description = 'Описание';
        $scope.recipe.Url = '';
        $scope.recipe.Picture = {};
        $scope.recipe.TimeToCook = 0;
        $scope.recipe.Ingredients = [];
        $scope.recipe.Steps = [];
    }

    $scope.addMore = function () {
        var recipe = {
            "Title": "Recipe2",
            "Url": "",
            "Picture": "",
            "Description": "desc",
            "TimeToCook": 0,
            "Ingredients": [],
            "Steps": []
        };
        Recipe.save(recipe);
    };

    $scope.save = function () {
        $scope.recipe.$save();
    };

    $scope.delete = function () {
            $scope.recipe.delete();
            $location.path('/');
        };

    $scope.addIngredient = function () {
        $scope.recipe.Ingredients.push({Title: '', HowMuch: ''})
    };

    $scope.removeIngredient = function (key) {
        $scope.recipe.Ingredients.splice(key, 1);
    };

    $scope.addStep = function () {
        $scope.recipe.Steps.push({Title: '', Html: '', Picture: {}})
    };

    $scope.removeStep = function (key) {
        $scope.recipe.Steps.splice(key, 1);
    };

    console.log('123');
});