angular.module('nofApp')
.controller('MainCtrl', function($scope, $state, $db_query, $ionicHistory) {
  
  // Debug DB
  $scope.isThisFirstRun = $db_query.getFirstRun();
  
  // DEBUG: Reset first run (back to Intro)
  $scope.firstRunReset = function(){
    $db_query.setFirstRun(true);
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('intro');
  };
});