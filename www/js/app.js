// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils','nofapp.utils'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('intro', {
      url: '/intro',
      templateUrl: 'templates/intro.html',
      controller: 'IntroCtrl'
    })
  .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
  .state('tabs.main', {
    url: '/main',
  views: {
            'main-tab': {
              templateUrl: 'templates/main.html',
              controller: 'MainCtrl'
            }
      }
  })
  .state('tabs.stats', {
    url: '/stats',
  views: {
            'stats-tab': {
              templateUrl: 'templates/stats.html',
              controller: 'StatsCtrl'
            }
      }
  })
  .state('tabs.enterdata', {
    url: '/enterdata',
  views: {
            'enterdata-tab': {
              templateUrl: 'templates/enterdata.html',
              controller: 'EnterDataCtrl'
            }
      }
  })
  .state('tabs.sex', {
    url: '/sex',
  views: {
            'sex-tab': {
              templateUrl: 'templates/sex.html',
              controller: 'SexCtrl'
            }
      }
  })
  .state('tabs.relapse', {
    url: '/relapse',
  views: {
            'relapse-tab': {
              templateUrl: 'templates/relapse.html',
              controller: 'RelapseCtrl'
            }
      }
  })
  .state('tabs.settings', {
    url: '/settings',
  views: {
            'settings-tab': {
              templateUrl: 'templates/settings.html',
              controller: 'SettingsCtrl'
            }
      }
  });

  $urlRouterProvider.otherwise("/tab/main");

})

// Main App Controller
.controller('MainCtrl', function($scope, $state, $db_query, $ionicHistory) {
  
  // Debug DB
  $scope.isThisFirstRun = $db_query.getFirstRun();
  
  //if($db_query.getFirstRun()) {
  //  $state.go('intro');
  //}
  
  // DEBUG: Reset first run (back to Intro)
  $scope.firstRunReset = function(){
    $db_query.setFirstRun(true);
    $ionicHistory.currentView($ionicHistory.backView());
      $state.go('intro');
  };
  
  
})

// Stats Controller
.controller('StatsCtrl', function($scope, $state, $db_query) {

})

// Sex Controller
.controller('EnterDataCtrl', function($scope, $state, $db_query) {

})

// Sex Controller
.controller('SexCtrl', function($scope, $state, $db_query) {

})

// Relapse Controller
.controller('RelapseCtrl', function($scope, $state, $db_query) {

})

// Settings Controller
.controller('SettingsCtrl', function($scope, $state, $db_query, $ionicHistory, $ionicPopup) {
  
  // Reset App
  $scope.resetApp = function() {
    $db_query.resetDb();
      $db_query.setFirstRun(true);
      $ionicHistory.currentView($ionicHistory.backView());
    $state.go('intro');
  }
  
  $scope.showConfirmResetApp = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Are You Sure, Fapstronaut?',
       template: 'Are you sure you want to reset NofAPP? All data and fapping will be lost.',
     okType: 'button-assertive'
     });
     confirmPopup.then(function(res) {
       if(res) {
       $scope.resetApp();
       }
     });
   };
  
})


// Intro Controller
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $ionicPopup, $db_query, $ionicHistory, $location) {
  
  // Debug DB
  $scope.isThisFirstRun = $db_query.getFirstRun();
  
  // Buttons click when intro is done
  $scope.firstRunDone = function() {
    $db_query.setFirstRun(false);
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('tabs.main');
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
    isMaxSexDays: function() {return this.values.sexDaysAgo >= 30},
    pastDaysInWords: function(day) {
      var words = NofappHelpers
      .verbalizeNumber(day, ['today', 'yesterday', '%d days ago']);
      return words;
    }
  };
  
  // Tests whether the user has clicked all fields.
  // He shouldnt submit the form without editing some (all) data.
  $scope.userHasInteractedCompletely = function(whatHasHeDone) {
    // Initial Declaration
    if (typeof clicked_mood === "undefined") {
        clicked_mood = false,
          clicked_energy = false,
          clicked_sex = false,
          clicked_fap = false;
    }
      
    switch (whatHasHeDone) {
      case "clicked_mood": clicked_mood = true; break;
      case "clicked_energy": clicked_energy = true; break;
      case "clicked_sex": clicked_sex = true; break;
      case "clicked_fap": clicked_fap = true; break;
    }
    
    // Debug
    if (clicked_mood && clicked_energy && clicked_sex && clicked_fap) {
      console.log("First User Interaction complete.")
    }
    
    // Return true if all fields have been clicked
    return clicked_mood && clicked_energy && clicked_sex && clicked_fap;
  }
  
  $scope.setMood = function(i) {
    $scope.userState.values.mood = i;
  $scope.userHasInteractedCompletely("clicked_mood");
  };
  
  $scope.isCurrentMood = function(i) {
    if ($scope.userState.values.mood === i) {
      return 'active';
    };
  };
  
  $scope.setEnergy = function(i) {
    $scope.userState.values.energy = i;
  $scope.userHasInteractedCompletely("clicked_energy");
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
  
  // Slide Box Control
  $scope.nextSlide = function() {
      $ionicSlideBoxDelegate.next();
  }
  
  $scope.openLastFap = function() {
  $scope.userHasInteractedCompletely("clicked_fap");
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
  $scope.userHasInteractedCompletely("clicked_sex");
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
  
  $scope.submitForm = function() {
    if (!$scope.userHasInteractedCompletely()) {
      console.log("User has not interacted completely!");
      var alertPopup = $ionicPopup.alert({
           title: "Not so fast, Fapstronaut!",
           template: "Make sure to enter your data, including last sex and last fap.",
         okType: "button-royal"
         });
      return false;
    }
    else {
      console.log("Writing first Dataset to DB.");
          
      // Calculate Timestamp (Past) for last fap and last sex
      var timestamp = Math.floor(Date.now() / 1000);
      var timestamp_lastSex = timestamp - (60*60*24*$scope.userState.values.sexDaysAgo);
      var timestamp_lastFap = timestamp - (60*60*24*$scope.userState.values.fapDaysAgo);
      
      console.log("Mood: " + $scope.userState.values.mood + " Energy: " + $scope.userState.values.energy + " FapDaysAgo: " + $scope.userState.values.fapDaysAgo + " SexDaysAgo: " + $scope.userState.values.sexDaysAgo + " Fap Timestamp: " + timestamp_lastFap + " Sex Timestamp: " + timestamp_lastSex);
      
      
      // Write Mood and Energy to DB, Timestamp is added automatically (now)
      $db_query.addEventsToDb($scope.userState.values.mood, $scope.userState.values.energy);
      
      // Write Sex and Fap to DB
      $db_query.addSexToDb(timestamp_lastSex);
      $db_query.addRelapseToDb(timestamp_lastFap);
      
      // Alert User
      var alertPopup = $ionicPopup.alert({
           title: "Awesome!",
           template: "Way to get it started!",
         okType: "button-royal"
         });
      
      // Set firstRun = false and Redirect to Main 
      alertPopup.then($scope.firstRunDone());
      
    }
  }
})

.run(function($ionicPlatform, $location, $db_query, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  
  // Watch out, Jedi! localStorage can only save strings,
  // therefore we need the === operator!
    if ($db_query.getFirstRun() === "true") {
      $location.path('/intro');
    } else {
    $location.path('/tab/main');
    };
  $rootScope.$apply();
  });
  

});

var NofappHelpers = {
  isEmpty: function(obj) {
    return Object.keys(obj).length === 0;
  },

  verbalizeNumber: function(i, words) {
    if (i < words.length - 1) {
      return words[i];
    } else {
      return words[words.length - 1].replace("%d", i);
    }
  }
};


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
}]);

// Angular Module for entering data into the database
// The most awesome DB Manager!

angular.module('nofapp.utils', ['ionic.utils'])

.service('$db_query', function($localstorage, $rootScope) {
  // Initial Dataset for localStorage Database.
  this.getInitialDataset = function() {
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
  
  // Read Database
  this.getEventsDb = function() {
    console.log("Reading Database...");
  var structDb = $localstorage.getObject('struct');
  // Check for empty DB. Actually, this shouldn't happen
  // as the user should have entered some data already at this point
    if (NofappHelpers.isEmpty(structDb)) {
      console.log("structDb is empty. Initializing. This shouldn't have happened.")
      structDb = this.getInitialDataset();
      console.log("Wrote initial Dataset.");
    }
  return structDb;
  };
// Function to write mood and energy to the database.
  // Mood and energy should be int
  this.addEventsToDb = function(mood, energy) {
    var timestamp = Math.floor(Date.now() / 1000);
    console.log("Reading Database...");
    var structDb = $localstorage.getObject('struct');
    // Check if Database is empty and initialize
    if (NofappHelpers.isEmpty(structDb)) {
      console.log("structDb is empty. Initializing.")
      structDb = this.getInitialDataset();
      console.log("Wrote initial Dataset.");
    }
    // Write to struct
    structDb.mood.ts.push(timestamp);
    structDb.mood.val.push(mood);
    structDb.energy.ts.push(timestamp);
    structDb.energy.val.push(energy);
    
    // Write to DB
    $localstorage.setObject("struct", structDb);
    console.log("Wrote Events to DB.");
  };
  
  this.addSexToDb = function(sex_time) {
    var timestamp = Math.floor(Date.now() / 1000);
    // Overload: Check if sex_time is set, otherwise use now as time
    var sex_time = (typeof sex_time === "undefined") ? timestamp : sex_time;
    
    console.log("Reading Database...");
    var structDb = $localstorage.getObject('struct');
    // Check if Database is empty and initialize
    if (NofappHelpers.isEmpty(structDb)) {
      console.log("structDb is empty. Initializing.");
      structDb = this.getInitialDataset();
    }
    // Write to struct
    structDb.had_sex.push(sex_time);
    
    // Write to DB
    $localstorage.setObject("struct", structDb);
    console.log("Wrote Sex to DB.");
  };
  
  this.addRelapseToDb = function(relapse_time) {
    var timestamp = Math.floor(Date.now() / 1000);
    // Overload: Relapse Time is undefined, therefore use now as time
    var relapse_time = (typeof relapse_time === "undefined") ? timestamp : relapse_time;
    
    // Write to DB
    console.log("Reading Database...");
    var structDb = $localstorage.getObject('struct');
    
    if (NofappHelpers.isEmpty(structDb)) {
      console.log("structDb is empty. Initializing.");
      structDb = this.getInitialDataset();
    }
    // Write to Struct
    structDb.relapse.push(timestamp);
    
    // Write to DB
    $localstorage.setObject("struct", structDb);
    console.log("Wrote Relapse to DB. Duh");
  };
  
  this.resetDb = function() {
    var structDb = this.getInitialDataset();
    $localstorage.setObject("struct", structDb);
    console.log("Database reset.");
  };
  
  this.getFirstRun = function () {
    //var firstRun = NofappHelpers.isEmpty($localstorage.get('firstRun')) ? true : $localstorage.get('firstRun');
    //console.log("firstRun checked, result = " + firstRun);
  var firstRun = $localstorage.get("firstRun", "true");
    return firstRun;
  };
  
  this.setFirstRun = function(val) {
    // val = boolean, well not really, actually it's a string which is
  // either true or false, DUH
    $localstorage.set("firstRun", val);
    console.log("firstRun set to " + $localstorage.get("firstRun"));
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
