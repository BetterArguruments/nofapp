angular.module('nofApp')
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicPopup, $ionicHistory, $ionicLoading,
  $lsSettings, $ionicHistory, $location, $ionicModal, $sql_events, $q, $sqlite, $valuesToString) {
  
  // Clear History, so Android Back Button doesn't go to Main Screen
  $ionicHistory.clearHistory();
  
  // Buttons click when intro is done
  $scope.firstRunDone = function() {
    $lsSettings.set("firstRun", false);
    $scope.$emit('datasetChanged');
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('menu.home');
  };

  // Title Control, gets called on slide changed
  $scope.introViewTitle = "NofApp";
  var getNewTitle = function(slideNumber) {
    switch(slideNumber) {
      case 1: return "NofApp Features"; break;
      case 2: return "What is Nofap?"; break;
      default: return "NofApp";
    }
  }

  // Called each time the slide changes
  $scope.slideIndex = 0;
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    $scope.introViewTitle = getNewTitle(index);
  };

  // Slide Box Control
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  };
  
  // Footer Click
  $scope.footerClick = function() {
    switch($scope.slideIndex) {
      case 0: $ionicSlideBoxDelegate.next(); break;
      default: $scope.modal_enterdata_user.show();
    }
  };

  // Modals
  $ionicModal.fromTemplateUrl('templates/sub/intro/modal_enterdata_user.html', {
      scope: $scope,
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.modal_enterdata_user = modal;
  });
  
  $ionicModal.fromTemplateUrl('templates/sub/intro/modal_enterdata.html', {
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.modal_enterdata = modal;
  });
  
  $ionicModal.fromTemplateUrl('templates/sub/intro/modal_enterdata_help.html', {
      scope: $scope,
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.modal_enterdata_help = modal;
  });
  
  // Stepwise showing of Input Form
  $scope.step = 0;
  var setStep = function(step) {
    var lastStep = $scope.step;
    $scope.step = (step > lastStep) ? step : lastStep;
  };
  
  // User State
  $scope.userState = {
    values: {
      mood: 0,
      energy: 0,
      libido: 0,
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
      case "clicked_sex":
        clicked_sex = true;
        break;
      case "clicked_fap":
        clicked_fap = true;
        break;
    };

    // Return true if all fields have been clicked
    return clicked_sex && clicked_fap;
  }

  $scope.isSex = function(i) {
    if ($scope.userState.values.sex === i) {
      return 'active';
    };
  };
  
  $scope.setSex = function(i) {
    if (i === "m" || i === "f")  {
      $scope.userState.values.sex = i;
      setStep(1);
    };
  };
  
  $scope.$watch(function() {
    return $scope.userState.values.birthday;
  }, function(res) {
    if (typeof res !== undefined && $scope.step > 0) { setStep(2); }
  });
  
  $scope.continue = function() {
    if ($scope.userState.values.sex && $scope.userState.values.birthday) {
      $scope.step = 0;
      $scope.modal_enterdata.show();
    }
    else {
      $ionicPopup.alert({
        title: "Not so fast, Fapstronaut!",
        template: "Make sure you enter your Sex and Birthday.",
        okType: "button-royal"
      });
    }
  };
  
  $scope.back = function() {
    $scope.modal_enterdata.hide();
    $scope.step = 2;
  }

  $scope.setMood = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.values.mood = i;
      setStep(1);
      $scope.selectedMood = $valuesToString.toString("Mood", i);
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
      setStep(2);
      $scope.selectedEnergy = $valuesToString.toString("Energy", i);
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
      setStep(3);
      $scope.selectedLibido = $valuesToString.toString("Libido", i);
    };
  };

  $scope.isCurrentLibido = function(i) {
    if ($scope.userState.values.libido === i) {
      return 'active';
    };
  };

  $scope.openLastFap = function() {
    $ionicPopup.show({
      templateUrl: 'templates/sub/intro/popup_last-fap.html',
      title: 'Be honest!',
      subTitle: 'When did you last fap?',
      scope: $scope,
      buttons: [
        {
          text: 'Save',
          type: 'button-royal'
        }
      ]
    }).then(function() {
      $scope.userHasInteractedCompletely("clicked_fap");
      setStep(5);
    });
  };

  $scope.openLastSex = function() {
    $ionicPopup.show({
      templateUrl: 'templates/sub/intro/popup_last-sex.html',
      title: 'Make us proud!',
      subTitle: 'When did you last have sex?',
      scope: $scope,
      buttons: [
        {
          text: 'Save',
          type: 'button-royal'
        }
      ]
    }).then(function() {
      $scope.userHasInteractedCompletely("clicked_sex");
      setStep(4);
    });
  };

  $scope.submitForm = function() {
    if (!$scope.userHasInteractedCompletely()) {
      console.log("User has not interacted completely!");
      var alertPopup = $ionicPopup.alert({
        title: "Not so fast, Fapstronaut!",
        template: "Make sure you enter all data, including last sex and last fap.",
        okType: "button-royal"
      });
      return false;
    } else {
      console.log("Writing first Dataset to DB.");

      // Write Sex and Birthdate to localstorage
      $lsSettings.set("user_birthday", Math.floor((new Date($scope.userState.values.birthday).getTime()) / 1000));
      $lsSettings.set("user_sex", $scope.userState.values.sex);

      // Calculate Timestamp (Past) for last fap and last sex
      var timestamp = Math.floor(Date.now() / 1000);
      var timestamp_lastSex = timestamp - (60*60*24*$scope.userState.values.sexDaysAgo);
      var timestamp_lastFap = timestamp - (60*60*24*$scope.userState.values.fapDaysAgo);

      console.log("Mood: " + $scope.userState.values.mood + " Energy: " + $scope.userState.values.energy + " Libido: " + $scope.userState.values.libido + " FapDaysAgo: " + $scope.userState.values.fapDaysAgo + " SexDaysAgo: " + $scope.userState.values.sexDaysAgo + " Fap Timestamp: " + timestamp_lastFap + " Sex Timestamp: " + timestamp_lastSex);

      // Write Mood and Energy to DB, Timestamp is added automatically (now)
      var promises = [];
      promises.push($sql_events.add("Mood", $scope.userState.values.mood));
      promises.push($sql_events.add("Energy", $scope.userState.values.energy));
      promises.push($sql_events.add("Libido", $scope.userState.values.libido));

      // Write Sex and Fap to DB
      // Handle last sex on 'decades ago'
      if ($scope.userState.values.sexDaysAgo !== -1) {
        promises.push($sql_events.add("Sex", null, timestamp_lastSex));
      }
      promises.push($sql_events.add("Fap", null, timestamp_lastFap));
      
      $q.all(promises).then(function() {        
        // Set firstRun = false and Redirect to Main
        // TODO: Make Toast
        
        $scope.firstRunDone();
        $scope.$emit('datasetChanged');
        $scope.modal_enterdata.hide();
        $scope.modal_enterdata_user.hide();
        $ionicLoading.show({
          template: 'Awesome! Good Luck, Fapstronaut!',
          duration: 4500
            });
      })
      
    }
  }
});
