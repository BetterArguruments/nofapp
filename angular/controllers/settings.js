// Settings Controller
angular.module('nofApp')
.controller('SettingsCtrl', function($scope, $state, $db_query, $ionicHistory, $ionicPopup) {
  // Reset App
  $scope.resetApp = function() {
    $db_query.resetDb();
    $db_query.setFirstRun("not_done");
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