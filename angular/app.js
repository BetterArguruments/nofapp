// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils','ngCordova','nofapp.utils','ngAnimate','angularMoment','ngSanitize','ui.router','nvd3ChartDirectives'])

.run(function($ionicPlatform, $q, $state, $cordovaSQLite, $cordovaAppVersion, $cordovaInAppBrowser, 
  $lsSettings, $sqlite, $sql_init, $sql_debug, $rootScope, amMoment, $cordovaKeyboard, $cordovaSplashscreen,
  $localNotifications) {
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
    
    // Go to intro if first run
    if ($lsSettings.is("firstRun")) {
      //$location.path('/intro');
      $state.go('intro').then(function() {
        $cordovaSplashscreen.hide();
      });
    }
    else {
      $cordovaSplashscreen.hide();
    }
    
    // Debug: Delete DB, Create Sample Data (Localstorage, Old, for Upgrade)
    //$cordovaSQLite.deleteDB("nofapp.db");
    
    // Open SQLite Database
    db = $cordovaSQLite.openDB("nofapp.db");
    
    // Update Table Structure or Create Tables (First Time)
    $sql_init.init().then(function() {
      console.log("SQLite Init complete");
      //$sql_debug.createSampleDataset(8, 7)
    });

    // Check whether Notifications should be set up
    // $scope.$watch(function() {
    //   return $lsSettings.is("notifications");
    // }, function(value) {
    //     $localNotifications.setDailyReminder(value);
    //     console.log("localNotifications: Update: Daily Reminder set to " + value)
    //   });
    // });

  });
  
})

.config(function($ionicConfigProvider) {
  // Native Scrolling for Android
  // TODO: Native Scrolling for iOS once Ionic supports it
  //$ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
}) 

// Setting for Angular Moment.js to treat
// Timestamps as Unix Timestamps
.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
});
