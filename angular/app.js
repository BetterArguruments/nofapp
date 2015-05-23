// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils','ngCordova','nofapp.utils','ngAnimate','angularMoment','ngSanitize','ui.router'])

.run(function($ionicPlatform, $q, $location, $db_query, $cordovaSQLite, $cordovaAppVersion, $firstRunCheck, $sqlite, $sql_init, $sql_events, $rootScope, amMoment, $cordovaKeyboard) {
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
    
    // Debug: Delete DB, Create Sample Data (Localstorage, Old, for Upgrade)
    $cordovaSQLite.deleteDB("nofapp.db");
    $db_query.createSampleDataset(300,60);
    
    // Open SQLite Database
    db = $cordovaSQLite.openDB("nofapp.db");
    
    // Check whether tables exist and create, if necessary
    $sql_init.getTables().then(function(result) {
      if (result.length === 0) {
        // Create Tables
        $sql_init.createInitialTables()
          .then(function() {
            $sql_init.insertInitialData()
              .then(function() {
                $sqlite.query("SELECT * FROM event_types")
                .then(function(result) {
                  console.log(JSON.stringify($sqlite.getAll(result)));
                });
                
                
                // Debug SQL
                var qq = [];
                //qq.push($sql_events.addEvent("Mood", 4));
                //qq.push($sql_events.addEvent("Energy", 5));
                 //var q3 = $sql_events.addEvent("Libido", 1, 14324211111);
                 //var q4 = $sql_events.addEvent("Penis", 10);
                 $sql_events.addEvent("Libido", 3);
                 //$q.all(qq)
                 $sql_events.addEvent("Energy", 5)
                  .then(function() {
                    $sqlite.query("SELECT * FROM events")
                    .then(function(result) {
                      console.log(JSON.stringify($sqlite.getAll(result)));
                    });
                  });
              });
        });
      }
    }, function(error) {
      console.log(JSON.stringify(error));
    });
    

    // Go to intro if first run
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
