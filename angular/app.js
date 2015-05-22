// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils','ngCordova','nofapp.utils','ngAnimate','angularMoment','ngSanitize','ui.router'])

.run(function($ionicPlatform, $q, $location, $db_query, $cordovaSQLite, $firstRunCheck, $sqlite, $sql_structure, $rootScope, amMoment, $cordovaKeyboard) {
  // Initialize Angular Moment
  //amMoment.changeLocale('en-gb');

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      $cordovaKeyboard.hideAccessoryBar(true); // ngCordova Syntax, modified from standard Ionic Syntax
    }
    
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    // Debug: Delete DB
    $cordovaSQLite.deleteDB("nofapp.db");
    
    // Open SQLite Database
    db = $cordovaSQLite.openDB("nofapp.db");
    
    // Check whether tables exist and create, if necessary
    var sqlTableCount = $sql_structure.getTables();
    sqlTableCount.then(function(result) {
      if (result.length === 0) {
        // Create Tables
        var doInitialSql = $sql_structure.createInitialTables();
        doInitialSql.then(function() {
          $sql_structure.insertInitialData();
          
          // Debug SQL
          var sqlDebug = $sqlite.query("SELECT * FROM event_types");
          sqlDebug.then(function(result) {
            console.log(JSON.stringify($sqlite.getAll(result)));
          });
          
        });
      }
    }, function(error) {
      console.log(JSON.stringify(error));
    });
    


    // Check if Database is empty and initialize with initial Data
    //console.log(JSON.stringify($sql_structure.isSet()));
    //var isSet = $sql_structure.isSet();

    /*if ($sql_structure.isSet().length === 0) {
      console.log("Creating Initial Tables");
      $sql_structure.createInitialTables();
      $sql_structure.insertInitialData();
    }*/

    // Go to intro if first run
    // We should consider setting the "first run" flag
    // in SQLite instead of localstorage.
    if ($firstRunCheck.isFirstRun()) {
      $location.path('/intro');
    }    
  });

})

// Setting for Angular Moment.js to treat
// Timestamps as Unix Timestamps
.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
});
