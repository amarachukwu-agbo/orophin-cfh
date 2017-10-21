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

    const onSignupSuccessful = (response) => {
      console.log(response);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        $http.defaults.headers.common['x-access-token'] = `'Bearer${response.data.token}`;
        $location.path('/#!');
      }
    };

    const onError = (err) => {
      console.log(err, 'rr');
      $scope.data.name = '';
      $scope.data.email = '';
      $scope.data.password = '';
      $scope.error = err.data.message;
    };

    // function to signup user
    $scope.signUp = () => {
      if ($scope.data.name && $scope.data.email && $scope.data.password) {
        $http.post('/api/auth/signup', JSON.stringify($scope.data))
          .then(onSignupSuccessful, onError);
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });

  }]);