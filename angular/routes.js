angular.module('nofApp')
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
  .state('tabs.history', {
    url: '/history',
    views: {
      'history-tab': {
        templateUrl: 'templates/history.html',
        controller: 'HistoryCtrl'
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
  })
  .state('tabs.about', {
    url: '/about',
    views: {
      'settings-tab': {
        templateUrl: 'templates/about.html'
      }
    }
  })
  .state('tabs.beer', {
    url: '/beer',
    views: {
      'settings-tab': {
        templateUrl: 'templates/beer.html'
      }
    }
  });

  $urlRouterProvider.otherwise("/tab/main");

});