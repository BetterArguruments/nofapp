// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('nofApp', ['ionic','ionic.utils','nofapp.utils','ngAnimate','angularMoment','ngSanitize','ui.router','angularMoment'])

.run(function($ionicPlatform, $location, $db_query, $rootScope, amMoment) {
  // Initialize Angular Moment
  //amMoment.changeLocale('en-gb');
  
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