// Settings Controller
angular.module('nofApp')
.controller('SettingsCtrl', function($scope, $state, $q, $sql_init, $sql_events, $lsSettings, $ionicHistory, $ionicPopup, $fapsperiment) {
  
  // Some serious Settings Voodoo
  $scope.settings = {
    notifications: $lsSettings.is("notifications"),
    fapsperiment: $lsSettings.is("fapsperiment")
  };
  
  // Even more Voodoo, even more serious
  $scope.settingsToggle = function(setting) {
    $lsSettings.set(setting, $scope.settings[setting]);
    switch(setting) {
      case "fapsperiment":
        if($scope.settings.fapsperiment === true) {
          $fapsperiment.sync().then(function() {
            updateSyncCounts();
          }, function(err) {
            console.log(err);
          });
        }
    }
    $scope.$emit('settingsChanged');
  };
  
  // Fapsperiment
  
  var updateSyncCounts = function() {
    var promises = [$sql_events.getSync(0), $sql_events.getSync(1)];
    $q.all(promises).then(function(resArr) {
      $scope.numEventsNotSynced = resArr[0].length;
      $scope.numEventsSynced = resArr[1].length;
      $scope.fapsperimentLastSync = $lsSettings.get("fapsperiment_lastSync");
    });
  };
  updateSyncCounts();
  
  // Reset App
  $scope.resetApp = function() {
    $sql_init.reset();
    $lsSettings.reset();
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('intro');
  }
  
  // Reset App Confirm Dialog
  $scope.showConfirmResetApp = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Are You Sure, Fapstronaut?',
      template: 'Are you sure you want to reset NofAPP? All data and fapping will be lost.',
      okType: 'button-assertive'
    }).then(function(res) {
      if(res) {
        $scope.resetApp();
      }
    });
  };

});