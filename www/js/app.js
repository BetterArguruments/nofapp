// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils','dbManager'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html',
    controller: 'IntroCtrl'
  })
  .state('main', {
    url: '/main',
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  });

  $urlRouterProvider.otherwise("/main");

})

// Intro Controller
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $db_query, $ionicHistory) {
  // Check if it is first run, then go to Main
  if (!$db_query.getFirstRun()) {
	$ionicHistory.currentView($ionicHistory.backView());
  	$state.go('main');
  }
  
  // Buttons click when intro is done
  $scope.firstRunDone = function() {
	  $db_query.setFirstRun(false);
	  $ionicHistory.currentView($ionicHistory.backView());
	  $state.go('main');
  }
   
  $scope.userState = {
    mood: 3,
    energy: 3,
    hadSex: false
  };
  
  $scope.setMood = function(i) {
    $scope.userState.mood = i;
  };
  
  $scope.isCurrentMood = function(i) {
    if ($scope.userState.mood === i) {
      return 'active';
    };
  };
  
  $scope.setEnergy = function(i) {
    $scope.userState.energy = i;
  };
  
  $scope.isCurrentEnergy = function(i) {
    if ($scope.userState.energy === i) {
      return 'active';
    };
  };
  
  $scope.debug = function() {
    console.log($scope.userState);
  }
  
  // Called to navigate to the main app
  // Deprecated! See firstRunDone
  $scope.startApp = function() {
    $state.go('main');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

// Main App Controller
.controller('MainCtrl', function($scope, $state, $db_query, $ionicHistory) {
  // Check if first run, then go to Intro
	if ($db_query.getFirstRun()) {
		$ionicHistory.currentView($ionicHistory.backView());
		$state.go('intro');
	}
  
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

.run(function($ionicPlatform) {
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
});


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