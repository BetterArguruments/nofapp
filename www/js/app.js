// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils','dbManager'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('intro', {
    url: '/',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })
  .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  });

  $urlRouterProvider.otherwise("/");

})

// Intro Controller
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicPopup, $db_query, $ionicHistory, $location) {
  
  // Buttons click when intro is done
  $scope.firstRunDone = function() {
    $db_query.setFirstRun(false);
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('main');
  }

  $scope.userState = {
    values: {
      mood: 3,
      energy: 3,
      fapDaysAgo: 0,
      sexDaysAgo: 0
    },
    incFapDaysAgo: function() {this.values.fapDaysAgo++},
    decFapDaysAgo: function() {this.values.fapDaysAgo--},
    isMinFapDays: function() {return this.values.fapDaysAgo <= 0},
    isMaxFapDays: function() {return this.values.fapDaysAgo >= 30},
    incSexDaysAgo: function() {this.values.sexDaysAgo++},
    decSexDaysAgo: function() {this.values.sexDaysAgo--},
    isMinSexDays: function() {return this.values.sexDaysAgo <= 0},
    isMaxSexDays: function() {return this.values.sexDaysAgo >= 30}
  };
  
  $scope.setMood = function(i) {
    $scope.userState.values.mood = i;
  };
  
  $scope.isCurrentMood = function(i) {
    if ($scope.userState.values.mood === i) {
      return 'active';
    };
  };
  
  $scope.setEnergy = function(i) {
    $scope.userState.values.energy = i;
  };
  
  $scope.isCurrentEnergy = function(i) {
    if ($scope.userState.values.energy === i) {
      return 'active';
    };
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
  
  $scope.openLastFap = function() {
    $ionicPopup.show({
      templateUrl: 'popups/last-fap.html',
      title: 'Be honest!',
      subTitle: 'When did you last fap?',
      scope: $scope,
      buttons: [
        {
          text: 'Save',
          type: 'button-balanced'
        }
      ]
    });
  };
  
  $scope.openLastSex = function() {
    $ionicPopup.show({
      templateUrl: 'popups/last-sex.html',
      title: 'Make us proud!',
      subTitle: 'When did you last have sex?',
      scope: $scope,
      buttons: [
        {
          text: 'Save',
          type: 'button-balanced'
        }
      ]
    });
  };
})

// Main App Controller
.controller('MainCtrl', function($scope, $state, $db_query, $ionicHistory) {
  
  // Reset first run (back to Intro)
  $scope.firstRunReset = function(){
    $db_query.setFirstRun(true);
    $ionicHistory.currentView($ionicHistory.backView());
      $state.go('intro');
  };
})

// Angular Module for saving and retrieving Data into localStorage

angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

// Angular Module for entering data into the database
// The most awesome DB Manager!

angular.module('dbManager', ['ionic.utils'])

.service('$db_query', function($localstorage) {
  return {
  // Function to write mood and energy to the database.
  // Mood and energy should be int
  addEventsToDb: function(mood, energy) {
    var timestamp = Math.floor(Date.now() / 1000);
    console.log("Reading Database...");
    var structDb = $localstorage.getObject('struct');
    // Check if Database is empty and initialize
    if (isEmpty(structDb)) {
      console.log("structDb is empty. Initializing.")
      structDb = getInitialDataset();
      console.log("Wrote initial Dataset.");
    }
    // Write to struct
    structDb.mood.ts.push(timestamp);
    structDb.mood.val.push(mood);
    structDb.energy.ts.push(timestamp);
    structDb.energy.val.push(energy);
    
    // Write to DB
    $localstorage.setObject("struct", structDb);
    console.log("Wrote Dataset to DB.");
  },
  
  addSexToDb: function(last_sex_time) {
    var timestamp = Math.floor(Date.now() / 1000);
    // Overload: Check if last_sex_time is set, otherwise use now as time
    var last_sex_time = (typeof last_sex_time === "undefined") ? timestamp : last_sex_time;
    
    console.log("Reading Database...");
    var structDb = $localstorage.getObject('struct');
    // Check if Database is empty and initialize
    if (isEmpty(structDb)) {
      console.log("structDb is empty. Initializing.");
      structDb = getInitialDataset();
    }
    // Write to struct
    structDb.had_sex.ts.push(last_sex_time);
    
    // Write to DB
    $localstorage.setObject("struct", structDb);
    console.log("Wrote Dataset to DB.");
  },
  
  addRelapseToDb: function(relapse_time) {
    var timestamp = Math.floor(Date.now() / 1000);
    // Overload: Relapse Time is undefined, therefore use now as time
    var relapse_time = (typeof relapse_time === "undefined") ? timestamp : relapse_time;
    
    // Write to DB
    console.log("Reading Database...");
    var structDb = $localstorage.getObject('struct');
    
    if (isEmpty(relapseDb)) {
      console.log("structDb is empty. Initializing.");
      structDb = getInitialDataset();
    }
    // Write to Struct
    structDb.relapse.push(timestamp);
    
    // Write to DB
    $localstorage.setObject("struct", structDb);
    console.log("Wrote Relapse to DB. Duh");
  },
  
  resetDb: function() {
    var structDb = getInitialDataset();
    $localstorage.setObject("struct", structDb);
    console.log("Database reset.");
  },
  
  getFirstRun: function () {
    var firstRun = isEmpty($localstorage.get('firstRunDone')) ? true : $localstorage.get('firstRunDone');
    console.log("firstRun checked, result = " + firstRun);
    return firstRun;
  },
  
  setFirstRun: function(val) {
    // val = boolean
    $localstorage.set("firstRun", val);
    console.log("firstRun set to " + $localstorage.get("firstRun"));
  }
}
})

.run(function($ionicPlatform, $location, $db_query) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  
  if ($db_query.getFirstRun) {
    $location.path('/intro');
  }
})

/*
*  Angular Module for saving and retrieving Data into localStorage
*/

angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);


function isEmpty(obj) {
  return Object.keys(obj).length === 0;
};

/*
*   Initial Dataset for localStorage Database.
*/

function getInitialDataset() {
  return {
        mood: {
          ts: [],
          val: []
        },
        energy: {
          ts: [],
          val: []
        },
        had_sex: [],
        relapse: []
      };
};
