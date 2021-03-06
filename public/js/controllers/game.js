/* global introJs, localStorage */
angular.module('mean.system')
  .controller('GameController', ['$scope', 'game', '$http', '$timeout', '$location', 'MakeAWishFactsService', '$dialog', '$window', function ($scope, game, $http, $timeout, $location, MakeAWishFactsService, $dialog, $window) {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    $scope.searchTerm = '';
    $scope.invitedUsers = [];
    var makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();

    $scope.pickCard = function (card) {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            //delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = function () {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return { 'cursor': 'pointer' };
      } else {
        return {};
      }
    };
    $scope.sendPickedCards = function () {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      } else {
        return false;
      }
    };

    $scope.cardIsSecondSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      } else {
        return false;
      }
    };

    $scope.firstAnswer = function ($index) {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.secondAnswer = function ($index) {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.showFirst = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
    };

    $scope.showSecond = function (card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isCzar = function () {
      return game.czar === game.playerIndex;
    };

    $scope.isPlayer = function ($index) {
      return $index === game.playerIndex;
    };

    $scope.isCustomGame = function () {
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.isPremium = function ($index) {
      return game.players[$index].premium;
    };

    $scope.currentCzar = function ($index) {
      return $index === game.czar;
    };

    $scope.winningColor = function ($index) {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      } else {
        return '#f9f9f9';
      }
    };

    $scope.pickWinning = function (winningSet) {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = function () {
      return game.winningCard !== -1;
    };

    $scope.showStartGameModal = function () {
      if (game.players.length >= game.playerMinLimit) {
        $('#startGameModal').modal({ backdrop: true });
      } else {
        $('#notEnoughPlayersModal').modal({ backdrop: true });
      }
    };

    $scope.startGame = function () {
      $('#startGameModal').modal('hide');
      game.startGame();
    };

    $scope.beginGame = function () {
      game.beginGame();
    };

    $scope.shuffleCards = function (e) {
      if ($scope.isCzar()) {
        const card = $('#'+e.target.id);
        card.addClass('animated flipOutY');
        setTimeout(() => {
          $scope.beginGame();
          card.removeClass('animated flipOutY');
          $('#czarSelectCard').modal('hide');
        }, 700);
      }
    };

    $scope.abandonGame = function () {
      game.leaveGame();
      $location.path('/');
    };

    //
    $scope.searchUser = () => {
      const { searchTerm } = $scope;
      $scope.searchResult = [];
      if (searchTerm.length !== 0) {
        $http({
          method: 'GET',
          url: `/api/search/users?q=${searchTerm}`
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
      });
    };

    $scope.resetSearchTerm = () => {
      $scope.searchTerm = '';
    };

    $scope.isInvited = email => $scope.invitedUsers.indexOf(email) > -1;
    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', function () {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', function () {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
      if ($scope.isCzar() && game.state === 'czar pick card') {
        $('#czarSelectCard').modal('show');
      }
    });

    $scope.$watch('game.gameID', function () {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout(function () {
              var link = document.URL;
              var txt = 'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el').css({ 'text-align': 'center', 'font-size': '22px', 'background': 'white', 'color': 'black' }).text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    $scope.gameTour = introJs();

    $scope.gameTour.setOptions({
      steps: [{
        intro: 'Welcome to <img src="img/logo-2.png" height="40"> <br/> You want to play this game?, then let me take you on a quick tour.'
      },
      {
        element: '#question-container-outer',
        intro: 'Game needs a minimum of 3 players to start. Wait for the minimum number of players and start the game. Also when the game starts, the questions are displayed here.'
      },
      {
        element: '#timer-container',
        intro: 'You have 20 seconds to submit an answer. After time out, the CZAR selects his favorite answer. Whoever submits CZAR\'s favorite answer wins the round.'
      },
      {
        element: '#player-container',
        intro: 'Players in the current game are shown here'
      },
      {
        element: '#game-rules',
        intro: 'These are the rules of the game'
      },
      {
        element: '#answer-card',
        intro: 'When game start, the answer cards will be displayed here, then you can click on the funniest answer card relating to the question'
      },
      {
        element: '#chat',
        intro: 'Wish to chat with friend while playing game? You can chat with friends here'
      },
      {
        element: '#charity-widget-container',
        intro: 'Wish to help people in need? Click on this to donate'
      },
      {
        element: '#tweet',
        intro: 'Share game link with your followers via tweeter'
      },
      {
        element: '#abandon-game-button',
        intro: 'Played enough? Click this button to quit the game'
      },
      {
        element: '#retake-tour',
        intro: 'You can always take the tour again'
      },
      ]
    });
    $scope.takeTour = () => {
      if (!localStorage.takenTour) {
        const timeout = setTimeout(() => {
          $scope.gameTour.start();
          clearTimeout(timeout);
        }, 500);
        localStorage.setItem('takenTour', true);
      }
    };
    $scope.retakeTour = () => {
      localStorage.removeItem('takenTour');
      $scope.takeTour();
    };
    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame', null, true);
    } else {
      game.joinGame();
    }
  }]);
