// History Controller
angular.module('nofApp')
.controller('HistoryCtrl', function($scope, $state, $db_query, $rootScope) {
  
  // Check for Updates
  $rootScope.$on('datasetChanged', function() {
      $scope.awesomeHistory = $db_query.getHistoryAwesome();
  });
  
  $scope.awesomeHistory = $db_query.getHistoryAwesome();
  
  console.log($scope.awesomeHistory);
});