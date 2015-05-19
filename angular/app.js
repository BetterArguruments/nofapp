// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils','ngCordova','nofapp.utils','ngAnimate','angularMoment','ngSanitize','ui.router'])

.run(function($ionicPlatform, $location, $db_query, $rootScope, amMoment, $cordovaKeyboard) {
  // Initialize Angular Moment
  //amMoment.changeLocale('en-gb');

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      $cordovaKeyboard.hideAccessoryBar(true);
    }
    
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    if(window.cordova) {
      // App syntax
      db = $cordovaSQLite.openDB("nofapp.db");
    } else {
      // Ionic serve syntax
      db = window.openDatabase("nofapp.db", "1.0", "NofApp", -1);
    }

    // Go to intro if first run
    // We should consider setting the "first run" flag
    // in SQLite instead of localstorage.
    if ($db_query.isFirstRun()) {
      $location.path('/intro');
      $db_query.sql_initDb();
    }    
  });

})

// Setting for Angular Moment.js to treat
// Timestamps as Unix Timestamps
.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
});
