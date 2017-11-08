angular.module('mean.system')
  .controller('DashboardController', [
    '$scope',
    '$window',
    'Global',
    '$http',
    (
      $scope,
      $window,
      Global,
      $http
    ) => {
      $scope.global = Global;

      const onGetGameLogSuccess = (response) => {
        $scope.gameLogs = response.data.getGameLog;
      };

      const onGetGameLogError = (err) => {
        $scope.GameLogMessage = err.data.message;
      };

      const getGameLogReq = {
        method: 'GET',
        url: '/api/games/history',
        headers: {
          'x-access-token': $window.localStorage.getItem('token')
        }
      };
      // request to get game-logs data
      $http(getGameLogReq)
        .then(
          // success callback
          onGetGameLogSuccess,
          // error callback
          onGetGameLogError
        );

      const onGetLeaderBoardSuccess = (response) => {
        const leaderBoardData = response.data.leaderBoard;
        $scope.leaderBoards = [];
        angular.forEach(leaderBoardData, (value, key) => {
          $scope.leaderBoards.push({
            name: key,
            roundsWon: value
          });
        });
      };

      const onGetLeaderBoardError = (err) => {
        $scope.LeaderBoardMessage = err.data.message;
      };

      const getGameLeaderBoard = {
        method: 'GET',
        url: '/api/leaderBoard',
        headers: {
          'x-access-token': $window.localStorage.getItem('token')
        }
      };
      // request to get leaderboard data
      $http(getGameLeaderBoard)
        .then(
          // success callback
          onGetLeaderBoardSuccess,
          // error callback
          onGetLeaderBoardError
        );

      const onGetDonationsSuccess = (response) => {
        $scope.donations = response.data.getDonations;
      };

      const onGetDonationsError = (err) => {
        $scope.DonationMessage = err.data.message;
      };

      const getDonationsReq = {
        method: 'GET',
        url: '/api/donations',
        headers: {
          'x-access-token': $window.localStorage.getItem('token')
        }
      };
      // request to get donations data
      $http(getDonationsReq)
        .then(
          // success callback
          onGetDonationsSuccess,
          // error callback
          onGetDonationsError
        );
    }]);
