// Stats Controller
angular.module('nofApp')
.controller('StatsOverallCtrl', function($scope, $state, $window, $rootScope, $ionicHistory, $q, $lsSettings, $sql_events) {
  
  var updatePlotSizes = function(windowWidth) {
     $scope.plotWidth = windowWidth;
     $scope.plotHeight = 0.618 * windowWidth;
  };
  updatePlotSizes($window.innerWidth);
  
  var updateOverallStats = function() {
    $sql_events.getSeries("Fap").then(function(res) {
      $scope.fapSeries = res;
      $scope.numRelapses = res.length-1;
      formatFapSeries();
    });
  };
  
  var formatFapSeries = function() {
    var values = {x: [], y: []};
    var deltaValues = [];
    for (var i = 0; i < $scope.fapSeries.length-1; i++) {
      dayDiff = moment.unix($scope.fapSeries[i+1][0].time).diff(moment.unix($scope.fapSeries[i][0].time), "days");
      if (values.x.indexOf(dayDiff) >= 0) {
        values.y[values.x.indexOf(dayDiff)] += 1;
      }
      else {
        values.x.push(dayDiff);
        values.y[values.x.indexOf(dayDiff)] = 1;
      }
    }
    valuesSorted = [];
    for (i = 0; i < values.x.length; i++) {
      valuesSorted.push([values.x[i], values.y[i]]);
    }
    valuesSorted.sort(function(a, b) {
      return a[0] > b[0];
    });
    $scope.fapSeriesDurations = [{"key": "fapSeriesDurations", "values": valuesSorted}];
    calculateMeanFapDuration();
  };
  
  var calculateMeanFapDuration = function() {
    var nofapStreaks = 0;
    var nofapDays = 0;
    for (var i = 0; i < $scope.fapSeriesDurations[0].values.length; i++) {
      for (var j = 0; j < $scope.fapSeriesDurations[0].values[i][1]; j++) {
        nofapStreaks++;
        nofapDays += $scope.fapSeriesDurations[0].values[i][0];
      }
    }
    $scope.meanNofapDays = nofapDays / nofapStreaks;
  };
  
  $scope.colorFunction = function() {
  	return function(d, i) {
      return "#886aea";
      };
  }
  
  $rootScope.$on('datasetChanged', function() {
    updateOverallStats();
  });
  if (!$lsSettings.is("firstRun")) {
    updateOverallStats();
  };

});