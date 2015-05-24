angular.module('nofApp')

// Enter Data Controller
.controller('EnterDataCtrl', function($scope, $state, $db_query, $ionicPopup, $sql_events, $sqlite, $q) {

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
    // $db_query.addEventsToDb($scope.userState.mood, $scope.userState.energy); DEPRECATED
    //$db_query.addUsualDataToDb($scope.userState.mood, $scope.userState.energy, $scope.userState.libido);
    var promises = [];
    promises.push($sql_events.addEvent("Mood", $scope.userState.mood));
    promises.push($sql_events.addEvent("Energy", $scope.userState.energy));
    promises.push($sql_events.addEvent("Libido", $scope.userState.libido));
    
    // Check for Note and enter it into DB
    if ($scope.userState.note != "") {
        //$db_query.addToDb("note", $scope.userState.note);
        // TODO: Add Note
        //promises.push();
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
        //$db_query.addToDb("sex");
        $sql_events.addEvent("Sex").then(function() {
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
        //$db_query.addToDb("fap");
        $sql_events.addEvent("Fap").then(function() {
          console.log("Relapse added to DB. Oh noes!");
          $scope.$emit('datasetChanged');
          $state.go('tabs.history');
        })
      }
    });
  }
});