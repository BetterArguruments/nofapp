angular.module('nofApp')

// Enter Data Controller
.controller('EnterDataCtrl', function($scope, $state, $q, $ionicPopup, $sqlite, $sql_events, $sql_notes) {

  // set initial values for a new state
  // TODO: read values from db if last dataset < x minutes ago
  $scope.userState = {
    mood: 3,
    energy: 3,
    libido: 3,
    note: "",
    reset: function() {
      this.mood = 3;
      this.energy = 3;
      this.libido = 3;
      this.note = "";
    }
  };
  
  $scope.setMood = function(i) {
    if (1 <= i && i <= 5) {
      $scope.userState.mood = i;
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
    };
  };
  
  $scope.isCurrentLibido= function(i) {
    if ($scope.userState.libido === i) {
      return 'active';
    };
  };
  
  
  // Submit the mood/energy form and write new entries
  $scope.addDataset = function() {
    console.log(JSON.stringify($scope.userState));
    var promises = [];
    promises.push($sql_events.add("Mood", $scope.userState.mood));
    promises.push($sql_events.add("Energy", $scope.userState.energy));
    promises.push($sql_events.add("Libido", $scope.userState.libido));
    
    // Check for Note and enter it into DB
    if ($scope.userState.note != "") {
        $sql_notes.add($scope.userState.note).then(function() {
          console.log("Note added to DB");
          $scope.$emit('datasetChanged');
          $state.go('tabs.history');
        });
    }
    
    $q.all(promises).then(function() {
      $scope.userState.reset();
      $scope.$emit('datasetChanged');
      $state.go('tabs.history');
      
    });
  
  };
  
  $scope.justHadSex = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Are You Serious?',
      template: 'Please confirm!',
    okType: 'button-balanced'
    }).then(function(res) {
      if(res) {
        $sql_events.add("Sex").then(function() {
          console.log("Sex added to DB. Nice!");
          $scope.$emit('datasetChanged');
          $state.go('tabs.history');
        })
      }
    });
  }
  
  $scope.justRelapsed = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Oh Noes!',
      template: 'Please confirm!',
      okType: 'button-assertive'
    }).then(function(res) {
      if(res) {
        $sql_events.add("Fap").then(function() {
          console.log("Relapse added to DB. Oh noes!");
          $scope.$emit('datasetChanged');
          $state.go('tabs.history');
        })
      }
    });
  }
});