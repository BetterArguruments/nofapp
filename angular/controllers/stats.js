// Stats Controller
angular.module('nofApp')
.controller('StatsCtrl', function($scope, $state, $db_query) {
    // Sample Data Creator via Click
    $scope.createSampleData = function () {
        $db_query.createSampleDataset(150,60);
    };
    
    var structDb = $db_query.getStructDb();
});