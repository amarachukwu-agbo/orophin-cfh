angular.module('mean.system')
  .controller('IndexController', [
    '$scope',
    '$window',
    'Global',
    '$location',
    '$cookies',
    '$cookieStore',
    'socket',
    'game',
    'AvatarService',
    '$http',


    (
      $scope,
      $window,
      Global,
      $location,
      $cookies,
      $cookieStore,
      socket,
      game,
      AvatarService,
      $http
    ) => {
      // check if token is saved in cookies
      $scope.checkCookieToken = () => {
        if ($cookies.token) {
          $window.localStorage.setItem('token', $cookies.token);
          $http.defaults.headers.common['x-access-token'] = $cookies.token;
        }
      };
      $scope.showAuthPage = () => {
        if ($window.localStorage.getItem('token')) {
          $location.path('/');
        }
        return true;
      };
      $scope.global = Global;
      $scope.data = {};
      $scope.checkCookieToken();

      $scope.playAsGuest = () => {
        game.joinGame();
        $location.path('/app');
      };

      $scope.showError = () => {
        if ($location.search().error) {
          return $location.search().error;
        }
        return false;
      };

      const onAuthSuccessful = (response) => {
        if (response.data.token) {
          // add token to localstorage
          $window.localStorage.setItem('token', response.data.token);
          // make token availbale for subsequent network request
          $http.defaults.headers.common['x-access-token'] = response.data.token;
          // transition to home page
          $location.path('/');
        }
      };

      const onError = (err) => {
        // clear input fields
        $scope.data.name = '';
        $scope.data.email = '';
        $scope.data.password = '';
        // set error message
        $scope.errorMessage = err.data.message;
        // clear error message  after 5 seconds
        setTimeout(() => {
          $scope.error = '';
        }, 5000);
      };

      $scope.login = () => {
        const auth = {
          email: $scope.data.email,
          password: $scope.data.password
        };
        $http.post('/api/auth/login', { auth })
          .then(
            // success callback
            onAuthSuccessful,
            // error callback
            onError
          );
      };

      // function to signup user
      $scope.signUp = () => {
        if ($scope.data.name && $scope.data.email && $scope.data.password) {
          $http.post('/api/auth/signup', JSON.stringify($scope.data))
            .then(
              // success callback
              onAuthSuccessful,
              // error callback
              onError
            );
        }
      };

      // function to signout user
      $scope.signOut = () => {
        // make signout http request
        $http.get('/signout').success(() => {
          // clear token from cookies
          angular.forEach($cookies, (v, k) => {
            $cookieStore.remove(k);
          });
          // clear token from local storage
          $window.localStorage.removeItem('token');
          $location.path('/');
          $window.location.reload();
        });
      };

      $scope.avatars = [];
      AvatarService.getAvatars()
        .then((data) => {
          $scope.avatars = data;
        });
    }]);
