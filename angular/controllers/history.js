// History Controller
angular.module('nofApp')
.controller('HistoryCtrl', function($scope, $state, $db_query) {
  
  $scope.message = {
     text: 'hello world!',
     time: Math.floor(Date.now() / 1000)
  };
  
  /*$scope.isHistoryEmpty = function() {
    return NofappHelpers.isEmpty($db_query.getStructDb());
  };
  
  $scope.fetchHistory = function() {
    console.log($db_query.getStructDb());
    console.log($db_query.getStructDbAndMelt());
    return $db_query.getStructDbAndMelt();
  };
  
  $scope.historySorted = $db_query.getStructDbAndMelt();*/
});