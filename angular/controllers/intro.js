angular.module('nofApp')
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicPopup, $db_query, $ionicHistory, $location, $ionicModal) {
  // Buttons click when intro is done
  $scope.firstRunDone = function() {
    $db_query.firstRunDone();
    $scope.$emit('datasetChanged');
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('tabs.main');
  };

  /*
  *  Slider and Title Control
  */

  // Title Control, gets called on slide changed
  $scope.introViewTitle = "NofApp";
  $scope.getNewTitle = function(slideNumber) {
    switch(slideNumber) {
      case 1: return "Using NofApp"; break;
      case 2: return "Getting started"; break;
      default: return "NofApp";
    }
  }

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    $scope.introViewTitle = $scope.getNewTitle(index);
  };

  // Slide Box Control
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  };

  $ionicModal.fromTemplateUrl('templates/modals/intro-help-enterdata.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

  /*
  *  User State
  */

  $scope.userState = {
    values: {
      mood: 3,
      energy: 3,
      libido: 3,
      fapDaysAgo: 0,
      sexDaysAgo: -1
    },
    incFapDaysAgo: function() {this.values.fapDaysAgo++},
    decFapDaysAgo: function() {this.values.fapDaysAgo--},
    isMinFapDays: function() {return this.values.fapDaysAgo <= 0},
    isMaxFapDays: function() {return this.values.fapDaysAgo >= 30},
    incSexDaysAgo: function() {this.values.sexDaysAgo++},
    decSexDaysAgo: function() {this.values.sexDaysAgo--},
    isMinSexDays: function() {return this.values.sexDaysAgo <= -1},
    isMaxSexDays: function() {return this.values.sexDaysAgo >= 30},
    pastDaysInWords: function(day) {
      var words = NofappHelpers
      .verbalizeNumber(day, ['decades ago', 'just now', 'yesterday', '%d days ago'], true);
      return words;
    }
  };

  // Tests whether the user has clicked all fields.
  // He shouldnt submit the form without editing some (all) data.
  $scope.userHasInteractedCompletely = function(whatHasHeDone) {
    // Initial Declaration
    if (typeof clicked_sex === "undefined") {
      clicked_sex = false,
      clicked_fap = false;
    };

    switch (whatHasHeDone) {
      case "clicked_sex": clicked_sex = true; break;
      case "clicked_fap": clicked_fap = true; break;
    };

    // Return true if all fields have been clicked
    return clicked_sex && clicked_fap;
  }

  $scope.setMood = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.values.mood = i;
    };
  };

  $scope.isCurrentMood = function(i) {
    if ($scope.userState.values.mood === i) {
      return 'active';
    };
  };

  $scope.setEnergy = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.values.energy = i;
    };
  };

  $scope.isCurrentEnergy = function(i) {
    if ($scope.userState.values.energy === i) {
      return 'active';
    };
  };

  $scope.setLibido = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.values.libido = i;
    };
  };

  $scope.isCurrentLibido = function(i) {
    if ($scope.userState.values.libido === i) {
      return 'active';
    };
  };

  $scope.openLastFap = function() {
    $ionicPopup.show({
      templateUrl: 'templates/popups/last-fap.html',
      title: 'Be honest!',
      subTitle: 'When did you last fap?',
      scope: $scope,
      buttons: [
        {
          text: 'Save',
          type: 'button-balanced'
        }
      ]
    }).then(function() {
      $scope.userHasInteractedCompletely("clicked_fap");
    });
  };

  $scope.openLastSex = function() {
    $ionicPopup.show({
      templateUrl: 'templates/popups/last-sex.html',
      title: 'Make us proud!',
      subTitle: 'When did you last have sex?',
      scope: $scope,
      buttons: [
        {
          text: 'Save',
          type: 'button-balanced'
        }
      ]
    }).then(function() {
      $scope.userHasInteractedCompletely("clicked_sex");
    });
  };

  $scope.submitForm = function() {
    if (!$scope.userHasInteractedCompletely()) {
      console.log("User has not interacted completely!");
      var alertPopup = $ionicPopup.alert({
        title: "Not so fast, Fapstronaut!",
        template: "Make sure to enter your data, including last sex and last fap.",
        okType: "button-royal"
      });
      return false;
    } else {
      console.log("Writing first Dataset to DB.");

      // Calculate Timestamp (Past) for last fap and last sex
      var timestamp = Math.floor(Date.now() / 1000);
      var timestamp_lastSex = timestamp - (60*60*24*$scope.userState.values.sexDaysAgo);
      var timestamp_lastFap = timestamp - (60*60*24*$scope.userState.values.fapDaysAgo);

      console.log("Mood: " + $scope.userState.values.mood + " Energy: " + $scope.userState.values.energy + " FapDaysAgo: " + $scope.userState.values.fapDaysAgo + " SexDaysAgo: " + $scope.userState.values.sexDaysAgo + " Fap Timestamp: " + timestamp_lastFap + " Sex Timestamp: " + timestamp_lastSex);


      // Write Mood and Energy to DB, Timestamp is added automatically (now)
      $db_query.addUsualDataToDb($scope.userState.values.mood, $scope.userState.values.energy, $scope.userState.values.libido);

      // Write Sex and Fap to DB
      console.log("Last sex: " + $scope.userState.values.sexDaysAgo);
      if ($scope.userState.values.sexDaysAgo !== -1) {
        $db_query.addToDb("sex", undefined, timestamp_lastSex);
      }
      $db_query.addToDb("fap", undefined, timestamp_lastFap);

      // Update Views
       $scope.$emit('datasetChanged');

      // Alert User
      // TODO: make toast
      var alertPopup = $ionicPopup.alert({
        title: "Awesome!",
        template: "Way to get it started!",
        okType: "button-royal"
      });

      // Set firstRun = false and Redirect to Main
      alertPopup.then($scope.firstRunDone());
    }
  }
});
