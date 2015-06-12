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
    .state('menu.tabs_enterdata', {
      url : '/tabs_enterdata',
      abstract : true,
      views: {
        'view-content': {
          templateUrl: "templates/sub/enterdata/tabs.html",
        }
      }
    })
    .state('menu.tabs_enterdata.enterdata_mood', {
      url: '/enterdata_mood',
      views: {
        'enterdata_mood': {
          templateUrl: "templates/sub/enterdata/page_mood.html",
          controller: "EnterdataCtrl"
        }
      }
    })
    .state('menu.tabs_enterdata.enterdata_sex', {
      url: '/enterdata_sex',
      views: {
        'enterdata_sex': {
          templateUrl: "templates/sub/enterdata/page_sex.html",
          controller: "EnterdataCtrl"
        }
      }
    })
    .state('menu.tabs_enterdata.enterdata_fap', {
      url: '/enterdata_fap',
      views: {
        'enterdata_fap': {
          templateUrl: "templates/sub/enterdata/page_fap.html",
          controller: "EnterdataCtrl"
        }
      }
    })
    .state('menu.notes', {
      url: '/notes',
      views: {
        'view-content': {
          templateUrl: "templates/notes.html",
          controller: "NotesCtrl"
        }
      }
    })
    .state('menu.notes_single', {
      url: '/notes_single/:noteID',
      views: {
        'view-content': {
          templateUrl: "templates/sub/notes/notes_single.html",
          controller: "NotesSingleCtrl"
        }
      },
      resolve: {
        noteData: function($stateParams, $sql_notes) {
          return $sql_notes.get($stateParams.noteID).then(function(res) {
            return res;
          });
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
          controller: "StatsOverallCtrl"
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
      cache: false,     // Disable Caching to display accurate Sync Statistics
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