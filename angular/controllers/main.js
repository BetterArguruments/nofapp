angular.module('nofApp')
.controller('MainCtrl', function($scope, $state, $ionicHistory, $rootScope, $sqlite, $sql_events) {


  // Check for Updates
  $rootScope.$on('datasetChanged', function() {
    updateLastFap();
  });

  // "Update" Function
  var updateLastFap = function () {
    var now = Math.floor(Date.now() / 1000);
    var lastFap = $sql_events.getLast("Fap");

    $scope.hasInterval = function(i) {
      var ary = $scope.progress.getNamedArray();
      return !typeof(ary[i] === 'undefined');
    };

    $scope.progress = {
      delta: new DeltaDate(now - lastFap),
      isDefined: function(i) {
        var asd = !(typeof(this.delta.getNamedArray()[i]) === 'undefined');
        return asd;
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
  };

  updateLastFap();
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
