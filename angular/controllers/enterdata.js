angular.module('nofApp')

// Enter Data Controller
.controller('EnterdataCtrl', function($scope, $state, $ionicHistory, $q, $ionicPopup, $ionicLoading, $ionicModal, $sqlite, $sql_events, $sql_notes, $valuesToString) {

  // Modals
  $ionicModal.fromTemplateUrl('templates/sub/enterdata/modal_enterdata_help.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal_enterdata_help = modal;
  });

  // set initial values for a new state
  // TODO: read values from db if last dataset < x minutes ago
  $scope.userState = {
    mood: 0,
    energy: 0,
    libido: 0,
    sex: 0,
    note: null,
    reset: function() {
      this.mood = this.energy = this.libido = 0;
      this.note = null;
      $scope.selectedMood = $scope.selectedEnergy = $scope.selectedLibido = null;
    }
  };
  
  $scope.setMood = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.mood = i;
      $scope.selectedMood = $valuesToString.toString("Mood", i);
    };
  };
  
  $scope.isCurrentMood = function(i) {
    if ($scope.userState.mood === i) {
      return 'active';
    };
  };
  
  $scope.setEnergy = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.energy = i;
      $scope.selectedEnergy = $valuesToString.toString("Energy", i);
    };
  };
  
  $scope.isCurrentEnergy = function(i) {
    if ($scope.userState.energy === i) {
      return 'active';
    };
  };
  
  $scope.setLibido = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.libido = i;
      $scope.selectedLibido = $valuesToString.toString("Libido", i);
    };
  };
  
  $scope.isCurrentLibido= function(i) {
    if ($scope.userState.libido === i) {
      return 'active';
    };
  };
  
  $scope.setSex = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.sex = i;
      $scope.selectedSex = $valuesToString.toString("Sex", i);
    };
  };
  
  $scope.isCurrentSex= function(i) {
    if ($scope.userState.libido === i) {
      return 'active';
    };
  };
  
  
  // Submit the mood/energy form and write new entries
  $scope.submitForm = function() {
    if ($scope.userState.mood === 0 || $scope.userState.energy === 0 || $scope.userState.libido === 0) {
      console.log("User has not interacted completely!");
      var alertPopup = $ionicPopup.alert({
        title: "Not so fast, Fapstronaut!",
        template: "Make sure you enter values for Mood, Energy and Libido",
        okType: "button-royal"
      });
      return false;
    }
    
    console.log(JSON.stringify($scope.userState));
    var now = Math.floor(Date.now() / 1000);
    var promises = [];
    promises.push($sql_events.add("Mood", $scope.userState.mood, now));
    promises.push($sql_events.add("Energy", $scope.userState.energy, now));
    promises.push($sql_events.add("Libido", $scope.userState.libido, now));
    
    if($scope.userState.note !== null) {
      promises.push($sql_notes.add($scope.userState.note, now));
    }
    
    $q.all(promises).then(function() {
      $scope.userState.reset();
      $scope.$emit('datasetChanged');
      
      // Super Hacky Fix to prevent missing Menu and Back Button after submitting form
      // https://github.com/driftyco/ionic/issues/1287
      $ionicHistory.currentView($ionicHistory.backView());
      
      $state.go('menu.tabs_stats.stats_lastfap');
      $ionicLoading.show({
        template: 'Data Saved.',
        duration: 2500
          });
    });
  
  };
  
  $scope.submitSex = function() {
    if ($scope.userState.sex === 0) {
      console.log("User has not interacted completely!");
      var alertPopup = $ionicPopup.alert({
        title: "Not so fast, Fapstronaut!",
        template: "Make sure you enter Sex Quality!",
        okType: "button-royal"
      });
      return false;
    }
    
    var now = Math.floor(Date.now() / 1000);
    var promises = [];
    promises.push($sql_events.add("Sex", $scope.userState.sex, now));
    
    if($scope.userState.note !== null) {
      promises.push($sql_notes.add($scope.userState.note, now));
    }
    
    $q.all(promises).then(function() {
      $scope.userState.reset();
      $scope.$emit('datasetChanged');
      
      // Super Hacky Fix to prevent missing Menu and Back Button after submitting form
      // https://github.com/driftyco/ionic/issues/1287
      $ionicHistory.currentView($ionicHistory.backView());
      
      $state.go('menu.history');
      $ionicLoading.show({
        template: 'Sex Saved. Nice!',
        duration: 2500
          });
    });
  };
  
  $scope.submitFap = function() {
    $ionicPopup.confirm({
      title: 'Relapsed?',
      template: 'Please confirm!',
    okType: 'button-assertive'
    }).then(function(res) {
      if(res) {
        var now = Math.floor(Date.now() / 1000);
        var promises = [];
        promises.push($sql_events.add("Fap", now));
    
        if($scope.userState.note !== null) {
          promises.push($sql_notes.add($scope.userState.note, now));
        }
    
        $q.all(promises).then(function() {
          $scope.userState.reset();
          $scope.$emit('datasetChanged');
      
          // Super Hacky Fix to prevent missing Menu and Back Button after submitting form
          // https://github.com/driftyco/ionic/issues/1287
          $ionicHistory.currentView($ionicHistory.backView());
      
          $state.go('menu.notes');
          $ionicLoading.show({
            template: 'Relapse Saved.',
            duration: 2500
              });
        });
      }
    });
    
  };
  
  // $scope.justHadSex = function() {
  //   var confirmPopup = $ionicPopup.confirm({
  //     title: 'Are You Serious?',
  //     template: 'Please confirm!',
  //   okType: 'button-balanced'
  //   }).then(function(res) {
  //     if(res) {
  //       $sql_events.add("Sex").then(function() {
  //         console.log("Sex added to DB. Nice!");
  //         $scope.$emit('datasetChanged');
  //         $state.go('tabs.history');
  //       })
  //     }
  //   });
  // };
  //
  // $scope.justRelapsed = function() {
  //   var confirmPopup = $ionicPopup.confirm({
  //     title: 'Oh Noes!',
  //     template: 'Please confirm!',
  //     okType: 'button-assertive'
  //   }).then(function(res) {
  //     if(res) {
  //       $sql_events.add("Fap").then(function() {
  //         console.log("Relapse added to DB. Oh noes!");
  //         $scope.$emit('datasetChanged');
  //         $state.go('tabs.history');
  //       })
  //     }
  //   });
  // };
});