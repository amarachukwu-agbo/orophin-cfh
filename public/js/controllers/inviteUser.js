angular.module('mean.system')
  .controller('InviteUserController', ['$scope', '$http', ($scope, $http) => {
    $scope.searchTerm = '';
    $scope.invitedUsers = [];
    $scope.message = '';
    $scope.searchUser = () => {
      const { searchTerm } = $scope;
      console.log(searchTerm);
      $scope.searchResult = [];
      if (searchTerm.length !== 0) {
        $http({
          method: 'GET',
          url: `/api/search/users?q=${$scope.searchTerm}`
        }).then((response) => {
          if (response.data) {
            response.data.forEach((user) => {
              $scope.searchResult.push(user);
            });
          }
        });
      } else {
        $scope.searchResult = [];
      }
    };

    $scope.inviteUser = (email) => {
      $scope.invitedUsers.push(email);
      return $http.post('/api/users/invite', {
        mailTo: email,
        gameLink: document.URL
      }).then(
        (res) => {
          console.log(res.data.message);
          $scope.message = res.data.message;
          console.log($scope.message);
          setTimeout(() => {
            $scope.message = '';
          }, 5000);
        },
        (err) => {
          console.log(err.data.message);
          $scope.message = err.data.message;
          setTimeout(() => {
            $scope.message = '';
          }, 5000);
        }
      );
    };

    $scope.resetSearchTerm = () => {
      $scope.searchTerm = '';
    };

    $scope.isInvited = email => $scope.invitedUsers.indexOf(email) > -1;
  }]);