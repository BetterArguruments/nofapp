// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils'])

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

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 
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

.controller('MainCtrl', function($scope, $state) {
  
  $scope.toIntro = function(){
    $state.go('intro');
  };
})

.controller('DbCtrl', function($localstorage, $scope) {
	
	/*
	*  Function to write mood, energy und had sex to the database.
	*  Mood and energy should be int, hadsex should be bool
	*/
	$scope.addEventsToDb = function(mood, energy) {
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
	};
	
	$scope.addSexToDb = function(last_sex_time) {
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
	}
	
	$scope.addRelapseToDb = function(relapse_time) {
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
