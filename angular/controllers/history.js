// History Controller
angular.module('nofApp')
.controller('HistoryCtrl', function($scope, $state, $db_query, $rootScope) {
  
  // Check for Updates
  $rootScope.$on('datasetChanged', function() {
    updateHistory();
  });
  
  // This is what we do
  var updateHistory = function() {
    $scope.awesomeHistory = $db_query.getHistoryAwesome();
  };
  
  updateHistory();
  
  $scope.createSampleData = function () {
      $db_query.createSampleDataset(300,60);
  };
});