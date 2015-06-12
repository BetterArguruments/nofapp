// Stats Controller
angular.module('nofApp')
.controller('StatsCtrl', function($scope, $state, $window, $rootScope, $ionicHistory, $q, $lsSettings, $sql_events) {

// "Watch" Function to refresh plots when device is rotated. Doesn't work.
//  Additionally, it sort of executes endlessly on iOS.
//
// $scope.$watch(function(){
//          return $window.innerWidth;
//       }, function(value) {
//          console.log("Window Width: " + value);
//          updatePlotSizes(value);
//          //$state.go($state.currentState, {}, {reload:true});
//          $ionicHistory.clearCache();
//          $state.go($ionicHistory.currentStateName(), {}, {reload: true});
//      });

  $scope.numDataPointsSinceLastFap = 0;
  // console.log($scope.numDataPointsSinceLastFap);
     
  var updatePlotSizes = function(windowWidth) {
     $scope.linePlotWidth = windowWidth;
     $scope.linePlotHeight = 0.618 * windowWidth;
  };
  updatePlotSizes($window.innerWidth);
  
  var prepareMEL = function(sql_res) {
    preparedArr = [];
    for (var i = 0; i < sql_res.length; i++) {
      preparedArr.push([sql_res[i].time, sql_res[i].value]);
    }
    return preparedArr;
  };
  
  var updateStats = function() {
    $sql_events.getLast("Fap").then(function(res) {
      var lastFapTime = res.time;
      // console.log(lastFapTime);
    
      p = [];
      p.push($sql_events.get("Mood", lastFapTime));
      p.push($sql_events.get("Energy", lastFapTime));
      p.push($sql_events.get("Libido", lastFapTime));
      p.push($sql_events.get("Sex", lastFapTime));
    
      $q.all(p).then(function(resArray) {
        valuesArr = [];
        for (var i = 0; i < resArray.length; i++) {
          valuesArr[i] = prepareMEL(resArray[i]);
        }
        $scope.moodSinceLastFap = [{"key": "Mood", "values": valuesArr[0]}];
        $scope.energySinceLastFap = [{"key": "Energy", "values": valuesArr[1]}];
        $scope.libidoSinceLastFap = [{"key": "Libido", "values": valuesArr[2]}];
        $scope.sexQualitySinceLastFap = [{"key": "Sex", "values": valuesArr[3]}];
        $scope.numDataPointsSinceLastFap = valuesArr[0].length;
        $scope.deltaX = (valuesArr[0].length > 0) ? valuesArr[0][valuesArr[0].length-1][0] - valuesArr[0][0][0] : 0;
        // console.log("deltaX: " + $scope.deltaX);
        //formatPlots();
      });
    });
  };

  var maxLabels = Math.floor($window.innerWidth / 72);
  var triggerFormat = [3600, 84000];
  
  $scope.xAxisTickValuesFunction = function() {
    return function(d){
      var tickVals = [];
      var values = d[0].values;
      // console.log("maxLabels: " + maxLabels);
      // console.log(JSON.stringify(values));
      var deltaX = values[values.length-1][0] - values[0][0];
      var tickNum = (values.length < maxLabels) ? values.length : maxLabels;
      var lastTick = 0;
      
      for (var i in values) {
        if ((values[i][0] - lastTick) > (deltaX / tickNum)) {
          tickVals.push(values[i][0]);
          lastTick = values[i][0];
        }
      }
      
      // console.log(JSON.stringify(tickVals));
      return tickVals;
    };
  };
  
  $scope.xAxisTickFormatFunction = function(){
    return function(d){
      // console.log(JSON.stringify(d));
      if ($scope.deltaX < triggerFormat[0]) {
        return d3.time.format('%H:%M')(moment.unix(d).toDate());
      }
      else if ($scope.deltaX < triggerFormat[1]) {
        return d3.time.format('%H:%M')(moment.unix(d).toDate());
      }
      else {
        return d3.time.format('%d/%m')(moment.unix(d).toDate());
      }
      
    }
  };
  
  $scope.colorFunction = function() {
  	return function(d, i) {
      return "#886aea";
      };
  }


  $rootScope.$on('datasetChanged', function() {
    updateStats();
  });
  if (!$lsSettings.is("firstRun")) {
    updateStats();
  };
  
});