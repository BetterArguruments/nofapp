// History Controller
angular.module('nofApp')
.controller('HistoryCtrl', function($scope, $state, $rootScope, $historyParser) {
  
  // Check for Updates
  $rootScope.$on('datasetChanged', function() {
    updateHistory();
  });
  
  // This is what we do
  var updateHistory = function() {
    $historyParser.getAwesome().then(function(res) {
      $scope.awesomeHistory = res;
    });
  };
  
  updateHistory();
});