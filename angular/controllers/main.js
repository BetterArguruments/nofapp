angular.module('nofApp')
.controller('MainCtrl', function($scope, $state, $db_query, $ionicHistory, $rootScope) {
  
  // Debug DB
  $scope.isThisFirstRun = $db_query.getFirstRun();
  
  // DEBUG: Reset first run (back to Intro)
  $scope.firstRunReset = function(){
    $db_query.setFirstRun(true);
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('intro');
  };
  
  // Check for Updates
  $rootScope.$on('datasetChanged', function() {
      $scope.lastFap = $db_query.getLastFap();
  });
  
  $scope.lastFap = $db_query.getLastFap();
  var timestampNow = Math.floor(Date.now() / 1000);
  var timeDiff = timestampNow - $scope.lastFap;
  var days = timeDiff % (60*60*24*7);
  var weeks = (timeDiff - days) / (60*60*24*7);
  
  $scope.count = {
    main: {
      value: weeks,
      unit: 'weeks'
    },
    side: {
      value: Math.floor(days / 86400),
      unit: 'days',
      /*isHidden: function() {
        if (this.value === 0) {
          return 'hidden';
        }
      }*/
    }
  }
});