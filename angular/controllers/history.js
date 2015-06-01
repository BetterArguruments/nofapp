// History Controller
angular.module('nofApp')
.controller('HistoryCtrl', function($scope, $state, $rootScope) {
  
  // Check for Updates
  $rootScope.$on('datasetChanged', function() {
    updateHistory();
  });
  
  // This is what we do
  var updateHistory = function() {
    $scope.awesomeHistory = $historyParser.getHistoryAwesome();
  };
  
  updateHistory();
});