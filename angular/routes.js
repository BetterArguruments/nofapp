angular.module('nofApp')
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('intro', {
      url: '/intro',
      templateUrl: 'templates/intro.html',
      controller: 'IntroCtrl'
    })
    .state('menu', {
      url : '/menu',
      templateUrl : 'templates/menu.html',
      abstract : true,
    })
    .state('menu.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: "templates/home.html",
          controller: "HomeCtrl"
        }
      }
    })
    .state('menu.stats', {
      url: '/stats',
      views: {
        'menuContent': {
          templateUrl: "templates/stats.html",
          controller: "StatsCtrl"
        }
      }
    })
    .state('menu.enterdata', {
      url: '/enterdata',
      views: {
        'menuContent': {
          templateUrl: "templates/enterdata.html",
          controller: "EnterDataCtrl"
        }
      }
    })
    .state('menu.history', {
      url: '/history',
      views: {
        'menuContent': {
          templateUrl: "templates/history.html",
          controller: "HistoryCtrl"
        }
      }
    })
    .state('menu.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: "templates/settings.html",
          controller: "SettingsCtrl"
        }
      }
    })
    .state('menu.settings_about', {
      url: '/settings_about',
      views: {
        'menuContent': {
          templateUrl: "templates/sub/settings/page_about.html",
          controller: "SettingsCtrl"
        }
      }
    })
    .state('menu.settings_beer', {
      url: '/settings_beer',
      views: {
        'menuContent': {
          templateUrl: "templates/sub/settings/page_beer.html",
          controller: "SettingsCtrl"
        }
      }
    })
    .state('menu.settings_fapsperiment', {
      url: '/settings_fapsperiment',
      views: {
        'menuContent': {
          templateUrl: "templates/sub/settings/page_fapsperiment.html",
          controller: "SettingsCtrl"
        }
      }
    });

  $urlRouterProvider.otherwise("/menu/home");

});