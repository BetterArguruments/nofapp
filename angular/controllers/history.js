// History Controller
angular.module('nofApp')
.controller('HistoryCtrl', function($scope, $state, $db_query) {
  
  $scope.message = {
     text: 'hello world!',
     time: Math.floor(Date.now() / 1000)
  };
  
  $scope.awesomeHistory = $db_query.getHistoryAwesome();
  console.log($scope.awesomeHistory);
});