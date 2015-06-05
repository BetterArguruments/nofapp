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
        'view-content': {
          templateUrl: "templates/home.html",
          controller: "HomeCtrl"
        }
      }
    })
    .state('menu.enterdata', {
      url: '/enterdata',
      views: {
        'view-content': {
          templateUrl: "templates/enterdata.html",
          controller: "EnterDataCtrl"
        }
      }
    })
    .state('menu.tabs_stats', {
      url : '/tabs_stats',
      abstract : true,
      views: {
        'view-content': {
          templateUrl: "templates/sub/stats/tabs.html",
        }
      }
    })
    .state('menu.tabs_stats.stats_lastfap', {
      url: '/stats_lastfap',
      views: {
        'stats_lastfap': {
          templateUrl: "templates/sub/stats/page_lastfap.html",
          controller: "StatsCtrl"
        }
      }
    })
    .state('menu.tabs_stats.stats_overall', {
      url: '/stats_overall',
      views: {
        'stats_overall': {
          templateUrl: "templates/sub/stats/page_overall.html",
          controller: "StatsCtrl"
        }
      }
    })
    .state('menu.tabs_stats.stats_web', {
      url: '/stats_web',
      views: {
        'stats_web': {
          templateUrl: "templates/sub/stats/page_web.html",
          controller: "StatsCtrl"
        }
      }
    })
    .state('menu.history', {
      url: '/history',
      views: {
        'view-content': {
          templateUrl: "templates/history.html",
          controller: "HistoryCtrl"
        }
      }
    })
    .state('menu.settings', {
      url: '/settings',
      views: {
        'view-content': {
          templateUrl: "templates/settings.html",
          controller: "SettingsCtrl"
        }
      }
    })
    .state('menu.settings_about', {
      url: '/settings_about',
      views: {
        'view-content': {
          templateUrl: "templates/sub/settings/page_about.html",
          controller: "SettingsCtrl"
        }
      }
    })
    .state('menu.settings_beer', {
      url: '/settings_beer',
      views: {
        'view-content': {
          templateUrl: "templates/sub/settings/page_beer.html",
          controller: "SettingsCtrl"
        }
      }
    })
    .state('menu.settings_fapsperiment', {
      url: '/settings_fapsperiment',
      views: {
        'view-content': {
          templateUrl: "templates/sub/settings/page_fapsperiment.html",
          controller: "SettingsCtrl"
        }
      }
    });

  $urlRouterProvider.otherwise("/menu/home");

});