// Stats Controller
angular.module('nofApp')
.controller('StatsWebCtrl', function($rootScope, $scope, $state, $q, $timeout, $sql_events, $lsSettings) {

  $scope.settings_fapsperiment = $lsSettings.is("fapsperiment");

  var updateSyncCounts = function() {
    var promises = [$sql_events.getSync(0), $sql_events.getSync(1)];
    $q.all(promises).then(function(resArr) {
      $scope.numEventsNotSynced = resArr[0].length;
      $scope.numEventsSynced = resArr[1].length;
      $scope.fapsperimentLastSync = $lsSettings.get("fapsperiment_lastSync");
    });
  }
  
  updateSyncCounts();


  // Firebase "no-scope-update-notification" Fix
  var fetchWebStats = function() {
    var q = $q.defer();
    
    var refStats = new Firebase("https://nofapp.firebaseio.com/stats");
    
    refStats.once("value", function(stats) {
      q.resolve(stats.val());
    });
    
    return q.promise;
  }
  
  var refreshWebStats = function() {
    fetchWebStats().then(function(res) {
      $scope.stats = res;
    });
  }
  
  refreshWebStats();

  $rootScope.$on('settingsChanged', function() {
    $scope.settings_fapsperiment = $lsSettings.is("fapsperiment");
  });
  
  $rootScope.$on('datasetChanged', function() {
    // Not-so-nice Workaround for checking the Sync Counts but waiting for the Sync to happen
    $timeout(function() {
      updateSyncCounts();
      refreshWebStats();
    }, 15000);
  });

});