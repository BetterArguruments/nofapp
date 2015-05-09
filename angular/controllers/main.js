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
  
  $scope.count = {
    main: {
      value: 2,
      unit: 'weeks'
    },
    side: {
      value: 4,
      unit: 'days',
      isHidden: function() {
        if (this.value === 0) {
          return 'hidden';
        }
      }
    }
  }
});