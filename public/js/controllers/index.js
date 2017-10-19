angular.module('mean.system')
  .controller('IndexController', ['$scope', '$window', 'Global', '$location', 'socket', 'game', '$http', 'AvatarService', function ($scope, Global, $window, $location, socket, game, $http, AvatarService) {
    $scope.global = Global;
    $scope.data = {};

    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function () {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    // function to signup user
    $scope.signUp = function () {
      $http.post('/api/auth/signup', JSON.stringify($scope.data))
        .then((user) => {
          if (user.data.token) {
            localStorage.setItem('token', user.data.token);
            $http.defaults.headers.common['x-access-token'] = `'Bearer${user.data.token}`;
            $location.path('/#!');
          }
        })
    }
    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });

  }]);