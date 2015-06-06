// Settings Controller
angular.module('nofApp')
.controller('SettingsCtrl', function($scope, $state, $sql_init, $lsSettings, $ionicHistory, $ionicPopup) {
  // Reset App
  $scope.resetApp = function() {
    $sql_init.reset();
    $lsSettings.reset();
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('intro');
  }
  
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