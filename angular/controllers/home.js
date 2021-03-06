angular.module('nofApp')
.controller('HomeCtrl', function($scope, $state, $ionicHistory, $ionicSideMenuDelegate, $rootScope, $sqlite, $sql_events, $sql_debug, $lsSettings) {

  // Debug: Insert Sample Data
  $scope.insertMoarData = function() {
    $sql_debug.createSampleDataset(50, 30).then(function() {
      $scope.$emit('datasetChanged');
      return true;
    });
  };
  
  // $scope.$watch(function() {
  //   return $lsSettings.isFirst("run");
  // }, function(value) {
  //   $scope.$watch(function() {
  //     return $ionicSideMenuDelegate.isOpenLeft();
  //   }, function(value2) {
  //     $scope.hide_tut_home_sideMenuHintButton = true;
  //     $lsSettings.setFirst("tut_home_sideMenuHintButton", "false");
  //   });
  // });
  
  var showTut = function() {
    if (!$lsSettings.is("firstRun") && $lsSettings.is("tut_home_showHintButtonSideMenu")) {
      var menuWatcher = $scope.$watch(function() {
        return $ionicSideMenuDelegate.isOpenLeft();
      }, function(value) {
        if (value) {
          $lsSettings.set("tut_home_showHintButtonSideMenu", "false");
          refreshTutButtons();
          menuWatcher();
        }
      });
    }
  }
  showTut();

  // Chceck whether to hide Button
  var refreshTutButtons = function() {
    $scope.sideMenuHintButton = $lsSettings.is("tut_home_showHintButtonSideMenu");
    $scope.fapsperimentHintButton = !$lsSettings.is("fapsperiment");
  };
  refreshTutButtons();

  $scope.toggleFapsperiment = function() {
    $state.go("menu.home_fapsperiment");
  };

  // Open Menu
  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  // Check for Updates
  $rootScope.$on('datasetChanged', function() {
    updateLastFap();
    showTut();
    refreshTutButtons();
  });

  // "Update" Function
  var updateLastFap = function () {
    var now = Math.floor(Date.now() / 1000);
    $sql_events.getLast("Fap").then(function(res) {
      var lastFap = res.time;
      $scope.hasInterval = function(i) {
        var ary = $scope.progress.getNamedArray();
        return !typeof(ary[i] === 'undefined');
      };

      $scope.progress = {
        delta: new DeltaDate(now - lastFap),
        isDefined: function(i) {
          return !(typeof(this.delta.getNamedArray()[i]) === 'undefined');
        },
        getString: function(i) {
          if (this.isDefined(i)) {
            return this.delta.getNamedArray()[i].to_s();
          };
        },
        isHidden: function(i) {
          if (isDefined(i)) {
            return 'hidden';
          }
        }
      }
    });
  };

  if (!$lsSettings.is("firstRun")) {
    updateLastFap();
  };
});

function DeltaDate(delta) {
  var s_day = (60 * 60 * 24);
  var s_week = (s_day * 7);
  var s_year = (s_day * 365);
  this.delta = delta;

  this.getYears = function() {
    return Math.floor(this.delta / s_year);
  };
  this.getWeeks = function() {
    return Math.floor((this.delta - (s_year * this.getYears())) / s_week);
  };
  this.getDays = function() {
    return Math.floor((this.delta % s_week) / s_day);
  };

  this.getNamedArray = function() {
    var day = ['day', 'days'];
    var week = ['week', 'weeks'];
    var year = ['year', 'years'];
    var ary = [];

    if (this.getYears() > 0) {
      ary.push(this.pluralize(this.getYears(), year));
    };
    if (this.getWeeks() > 0) {
      ary.push(this.pluralize(this.getWeeks(), week));
    };
    if (this.getDays() > 0) {
      ary.push(this.pluralize(this.getDays(), day));
    };
    return ary;
  };

  this.pluralize = function(number, word) {
    if (-1 <= number && number <= 1) {
      return {value: number, unit: word[0], to_s: function() {
        return this.value + " " + this.unit;
      }};
    } else {
      return {value: number, unit: word[1], to_s: function() {
        return this.value + " " + this.unit;
      }};
    };
  };
};
