angular.module('nofApp')

// Enter Data Controller
.controller('EnterDataCtrl', function($scope, $state, $db_query, $ionicPopup) {

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
    console.log($scope.userState);
    // $db_query.addEventsToDb($scope.userState.mood, $scope.userState.energy); DEPRECATED
    $db_query.addUsualDataToDb($scope.userState.mood, $scope.userState.energy, $scope.userState.libido);
    
    // Check for Note and enter it into DB
    if ($scope.userState.note != "") {
        $db_query.addToDb("note", $scope.userState.note);
        console.log("Note added to DB.");
    }
    
    $scope.userState.reset();
  };
  
  $scope.justHadSex = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Are You Serious?',
      template: 'Please confirm!',
    okType: 'button-balanced'
    }).then(function(res) {
      if(res) {
        // $db_query.addSexToDb(Math.floor(Date.now() / 1000)); DEPRECATED
        $db_query.addToDb("sex");
        console.log("Sex added to DB. Nice!");
      }
    });
  }
  
  $scope.justRelapsed = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Relapsed?',
      template: 'Please confirm!',
      okType: 'button-assertive'
    }).then(function(res) {
      if(res) {
        // $db_query.addRelapseToDb(Math.floor(Date.now() / 1000));
        $db_query.addToDb("fap");
        console.log("Relapse added to DB. Oh noes!");
      }
    });
  }
});