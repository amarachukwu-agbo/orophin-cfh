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
      if (response.data.token) {
        // set token in local storage
        localStorage.setItem('token', response.data.token);
        $http.defaults.headers.common['x-access-token'] = response.data.token;
        $location.path('/#!');
      }
    };

    const onError = (err) => {
      // clear input fields
      $scope.data.name = '';
      $scope.data.email = '';
      $scope.data.password = '';
      // set error message
      $scope.error = err.data.message;
      // clear error message  after 5 seconds
      setTimeout(() => {
        $scope.error = '';
      }, 5000);
    };

    // function to signup user
    $scope.signUp = () => {
      if ($scope.data.name && $scope.data.email && $scope.data.password) {
        $http.post('/api/auth/signup', JSON.stringify($scope.data))
          .then(onSignupSuccessful, onError);
      }
    };

    // function to signup user
    $scope.signOut = () => {
      // clear token from localStorage
      localStorage.clear();
      $location.path('/#!');
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });

  }]);