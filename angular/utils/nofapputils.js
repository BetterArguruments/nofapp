// Angular Module for entering data into the database
// The most awesome DB Manager!
angular.module('nofapp.utils', ['ionic.utils', 'ngCordova'])

.factory('$valuesToString', function($localstorage) {
  var self = this;
  
  self.toString = function(type, value) {
    if (type === "Mood") {
      switch(value) {
        case 1: return "very bad"; break;
        case 2: return "bad"; break;
        case 3: return "okay"; break;
        case 4: return "good"; break;
        case 5: return "very good"; break;
        default: return null;
      }
    }
    else if (type === "Energy" || type === "Libido") {
      switch(value) {
        case 1: return "very low"; break;
        case 2: return "low"; break;
        case 3: return "okay"; break;
        case 4: return "high"; break;
        case 5: return "very high"; break;
        default: return null;
      }
    }
    else if (type === "Sex") {
      switch(value) {
        case 1: return "bad"; break;
        case 2: return "very mediocre"; break;
        case 3: return "average"; break;
        case 4: return "really good"; break;
        case 5: return "mind-boggling"; break;
        default: return null;
      }
    }
    
  };
  
  return self;
})

.factory('$lsSettings', function($localstorage) {
  var initSettings = function() {
    var struct = { "firstRun": true,
      "user_sex": "",
      "user_birthday": "",
      "tut_home_showHintButtonSideMenu": true,
      "notifications": true,
      "fapsperiment": false,
      "fapsperiment_user": "",
      "fapsperiment_since": "",
      "fapsperiment_events_synced": 0,
      "fapsperiment_lastSync": 0
      };
    $localstorage.setObject("settings", struct);
  };
  
  var getSettings = function() {
    var struct = $localstorage.getObject("settings");
    if (typeof struct === undefined || NofappHelpers.isEmpty(struct)) {
      initSettings();
      var struct = $localstorage.getObject("settings");
    }
    return struct;
  }
  
  var setSettings = function(struct) {
    $localstorage.setObject("settings", struct);
  };
  
  var self = this;  
  
  self.is = function(setting) {
    console.log("lsSettings read (is): " + setting + " : " + getSettings()[setting]);
    return (getSettings()[setting] === "true" || getSettings()[setting] === true) ? true : false;
  }
  
  self.set = function(setting, val) {
    console.log("lsSettings write: " + setting + " = " + val);
    var struct = getSettings();
    struct[setting] = val;
    setSettings(struct);
  };
  
  self.get = function(setting) {
    console.log("lsSettings read (get): " + setting + " : " + getSettings()[setting]);
    return getSettings()[setting];
  }
   
  self.reset = function() {
    console.log("lsSettings: Reset");
    initSettings();
  };

  return self;
})

.factory('$sqlite', function($cordovaSQLite, $q, $ionicPlatform) {
  // https://gist.github.com/borissondagh/29d1ed19d0df6051c56f
  
  var self = this;
 
  // Handle queries and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();
 
    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(JSON.stringify(error));
          q.reject(error);
        });
    });
    return q.promise;
  }
 
  // Process a result set
  self.getAll = function(result) {
    var output = [];
 
    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  }
 
  // Process a single result
  self.getFirst = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }
 
  return self;
})

.factory('$sql_init', function($sqlite, $q, $cordovaSQLite, $cordovaAppVersion, $localstorage, $sql_events, $sql_notes) {
  var self = this;
  
  // Note: SQLite 3 has no Boolean Class, therefore synced is an Integer
  self.InitialTables = ["CREATE TABLE IF NOT EXISTS event_types (id integer primary key, name text)",
                        "CREATE TABLE IF NOT EXISTS events (id integer primary key, time integer, type integer, value integer, synced integer)",
                        "CREATE TABLE IF NOT EXISTS notes (id integer primary key, time integer, value text)",
                        "CREATE TABLE IF NOT EXISTS settings (id integer primary key, type text, value integer)"];

  self.InitialData = ["INSERT INTO event_types (name) VALUES ('Mood')",
                      "INSERT INTO event_types (name) VALUES ('Energy')",
                      "INSERT INTO event_types (name) VALUES ('Libido')",
                      "INSERT INTO event_types (name) VALUES ('Sex')",
                      "INSERT INTO event_types (name) VALUES ('Fap')"];
  
  self.getTables = function() {
    var q = $q.defer();
    
    $sqlite.query("SELECT name FROM sqlite_master WHERE type='table'")
      .then(function(result){
        q.resolve($sqlite.getAll(result));
      }, function(error) {
        q.reject(error);
      });
      
    return q.promise;
  };
  
  self.createInitialTables = function() {
    console.log("SQLite: Creating Initial Tables");
    
    var promises = [];
    
    for (var i = 0; i < self.InitialTables.length; i++) {
      promises.push($sqlite.query(self.InitialTables[i]));
    }
    
    return $q.all(promises);
  };
  
  self.insertInitialData = function() {
    console.log("SQLite: Inserting Initial Data");
    var promises = [];
    
    for (var i = 0; i < self.InitialData.length; i++) {
      promises.push($sqlite.query(self.InitialData[i]));
    }
    
    return $q.all(promises);
  };
  
  // Database Initializer or Upgrader:
  // Should be run in $ionicPlatform.ready()
  self.init = function() {
    var q = $q.defer();
    var structDb = $localstorage.getObject('struct');
    //console.log(JSON.stringify(structDb));

    self.getTables()
      .then(function(tableCount) {
        console.log("SQLite Init: SQLite Table Count: " + tableCount.length);
      
        if (tableCount.length !== 0) {
          console.log("SQLite Init: Stopped, found " + tableCount.length + " SQLite Tables");
          q.resolve(true);
        }
        else {
          console.log("SQLite Init: No SQLite Tables found. Creating initial Tables and starting Upgrader");
          self.createInitialTables()
            .then(function() {
              self.insertInitialData();
            })
            .then(function() {
              self.upgrade();
            })
            .then(function() {
              q.resolve(true);
            });
        }
      
      
      });
    
    return q.promise;
  };
  
  self.reset = function() {
    return $cordovaSQLite.deleteDB("nofapp.db")
      .then(function() {
        db = $cordovaSQLite.openDB("nofapp.db");
        return self.init();
      });
  }
  
  // Database Upgrader
  self.upgrade = function() {
    var q = $q.defer();
    var structDb = $localstorage.getObject('struct');
    
    return $cordovaAppVersion.getAppVersion().then(function(appVersion) {
      if (appVersion === "0.0.2") {
        if ((typeof structDb !== "undefined") && structDb.length > 0) {
          // User has old Data, Migrate 1 -> 2
          console.log("Updater: Found old localstorage Data, starting Migration 1 -> 2");
          return self.upgrade_from_1_to_2();
        }
        else {
          // User has no old Data
          console.log("Updater: No old localstorage Data found");
          q.resolve("Upgrade skipped");
        }
      }
    });
    
    return q.promise;
  }
  
  // Upgrade from v0.0.1 to v0.0.2
  self.upgrade_from_1_to_2 = function() {
    var structDb = $localstorage.getObject('struct');
    var promises = [];
    
    //$sql_notes.add("HELLO", 1432679581);
    
    for (var i = 0; i < structDb.length; i++) {
      switch(structDb[i][0]) {
      case "mood":
        promises.push($sql_events.add("Mood", structDb[i][2], structDb[i][1]));
        break;
      case "energy":
        promises.push($sql_events.add("Energy", structDb[i][2], structDb[i][1]));
        break;
      case "libido":
        promises.push($sql_events.add("Libido", structDb[i][2], structDb[i][1]));
        break;
      case "sex":
        promises.push($sql_events.add("Sex", null, structDb[i][1]));
        break;
      case "fap":
        promises.push($sql_events.add("Fap", null, structDb[i][1]));
        break;
      case "note":
        promises.push($sql_notes.add(structDb[i][2], structDb[i][1]));
        break;
      }
    }
    
    // Delete localstorage
    $localstorage.set("struct","");
    $localstorage.set("firstRun", ""); // Variable is now named "run"
    
    console.log("Migrating " + structDb.length + " localstorage Entries to " + promises.length + " SQLite Entries");
    return $q.all(promises);
  };

  return self;
})

.factory('$sql_event_types', function($sqlite, $q) {
  var self = this;
  
  self.getAll = function() {
    var q = $q.defer();
    
    $sqlite.query("SELECT id, name FROM event_types ORDER BY id ASC")
      .then(function(res) {
        q.resolve($sqlite.getAll(res));
      }, function(error) {
        q.reject(error);
      });
    
    return q.promise;
  }
  
  self.getId = function(eventName) {
    var q = $q.defer();
    
    $sqlite.query("SELECT id FROM event_types WHERE name = ?", [eventName])
      .then(function(result) {
        if (typeof $sqlite.getFirst(result) === "undefined") {
          q.reject("No Event Type ID found for Name " + eventName);
        }
        else {
          q.resolve($sqlite.getFirst(result).id);
        }
      }, function(error) {
        q.reject(error);
    });
    
    return q.promise;
  }
  
  return self;
})

.factory('$sql_events', function($q, $sqlite, $sql_event_types) {
  // https://gist.github.com/borissondagh/29d1ed19d0df6051c56f
  var self = this;
  
  self.add = function(type, value, time) {
    var q = $q.defer();
    
    // Get Timestamp(now) if undefined
    var addEventTime = (typeof time === "undefined") ? Math.floor(Date.now() / 1000) : time;
    
    // Set Value = null if undefined (e.g. for Sex and Fap)
    var addEventValue = (typeof value === "undefined") ? null : value;
    
    $sql_event_types.getId(type)
      .then(function(addEventTypeId) {
        console.log("Inserting Event: " + [addEventTime, addEventTypeId, addEventValue]);
        $sqlite.query("INSERT INTO events (time, type, value, synced) VALUES (?, ?, ?, ?)", [addEventTime, addEventTypeId, addEventValue, 0])
          .then(function() {
            q.resolve(true);
          });
      }, function(error) {
        q.reject(error);
      });
      
    return q.promise;
  }
  
  self.get = function(eventType, since, until) {
    var q = $q.defer();
    var timeSince = (typeof since === "undefined" || since === null) ? 0 : since;
    var timeUntil = (typeof until === "undefined" || until === null) ? 9992147483647 : until;
    
    $sql_event_types.getId(eventType)
      .then(function(eventTypeId) {
        return $sqlite.query("SELECT * FROM events WHERE type = ? AND time BETWEEN ? AND ? ORDER BY id ASC", [eventTypeId, timeSince, timeUntil-1])
          .then(function(res) {
            var events = $sqlite.getAll(res);
            for (i = 0; i < events.length; i++) {
              events[i].type = eventType;
            }
            q.resolve(events);
          });
      }, function(error) {
        q.reject(error);
      });
    
    return q.promise;
  }
  
  self.getLast = function(eventType) {
    var q = $q.defer();
    
    $sql_event_types.getId(eventType)
      .then(function(eventTypeId) {
        return $sqlite.query("SELECT * FROM events WHERE type = ? ORDER BY id DESC LIMIT 1", [eventTypeId])
          .then(function(res) {
            q.resolve($sqlite.getFirst(res));
          });
      }, function(error) {
        q.reject(error);
      });
      
    return q.promise;
  }
 
  self.getAll = function(since, until, sortBy) {
    var q = $q.defer();
    var timeSince = (typeof since === "undefined" || since === null) ? 0 : since;
    var timeUntil = (typeof until === "undefined" || until === null) ? 9992147483647 : until;
    var sqlSort = (typeof sortBy === "undefined" || sortBy === null) ? "id" : sortBy;
    console.log("ordering by " + sqlSort);

   
    $sql_event_types.getAll().then(function(eventTypes) {
      // SQLite seemingly doesnt accept sqlSort as a variable implemented via "?",
      // therefore we use stupid string concatenation
      $sqlite.query("SELECT * FROM events WHERE time BETWEEN ? AND ? ORDER BY "+ sqlSort +" ASC", [timeSince, timeUntil-1]).then(function(res) {
        var events = $sqlite.getAll(res);
        // Resolve Event TypeIds to Names
        for (var i = 0; i < events.length; i++) {
          var type = events[i].type - 1; // SQL event_types: [1-5]; Array: [0-4]
          if (type === null) {
            q.reject("Something fishy is going down in the Database!");
          }
          events[i].type = eventTypes[type].name;
        };
        q.resolve(events);
      });
    }), function(error) {
      q.reject(error);
    };
    
    return q.promise;
  };

  self.getSeries = function(eventType) {
    var q = $q.defer();
    var promises = [];
    var eventSeries = [];
    
    self.get(eventType).then(function(res) {
      for (var i = 0; i < res.length; i++) {
        eventSeries[i] = [];
        eventSeries[i][0] = res[i];
        var until = (typeof res[i+1] === "undefined") ? null : res[i+1].time;
        promises.push(self.getAll(res[i].time, until));
      }
      $q.all(promises).then(function(resArr) {
        for (var i = 0; i < resArr.length; i++) {
          for (var j = 0; j < resArr[i].length; j++) {
            if (resArr[i][j].type !== eventType) { eventSeries[i].push(resArr[i][j]) }
          }
        }
        q.resolve(eventSeries);
      });
    });
    
    return q.promise;
  };
  
  self.getSync = function(status) {
    var q = $q.defer();
    var querySync = (status === 1) ? 1 : 0;

    $sqlite.query("SELECT * FROM events WHERE synced=? ORDER BY id ASC", [querySync]).then(function(res) {
        var events = $sqlite.getAll(res);
        q.resolve(events);
      }, function(err) {
        q.reject(err);
      });
    
    return q.promise;
  };
  
  self.setSync = function(id, syncStatus) {
    var q = $q.defer();
    var setStatus = (syncStatus === 1) ? 1 : 0;

    $sqlite.query("UPDATE events SET synced=? WHERE id=?", [setStatus, id]).then(function(res) {
        q.resolve(true);
      }, function(err) {
        q.reject(err);
      });
    
    return q.promise;
  };
  
  // self.getSeries = function(eventType) {
  //   var q = $q.defer();
  //
  //   self.getAll().then(function(res) {
  //     var eventSeries = [][];
  //     for (var i, eventCount = -1; i < res.length; i++) {
  //       if (res[i].type === eventType) {
  //         eventCount++;
  //         // Go back and cut and paste some stuff
  //         j = i-1;
  //         while (res[j].time === res[i].time && j >= 0 && eventCount > 0) {
  //           eventSeries[eventCount].push(res[j]);
  //           eventSeries[eventCount-1]
  //           j--;
  //         }
  //       }
  //
  //       if (eventCount >= 0) {
  //         eventSeries[eventCount].push(res[i]);
  //       }
  //       else {
  //         continue;
  //       }
  //     }
  //     if (eventCount < 2) { q.reject("Less Than 2 Events, not getting Series!"); }
  //     else { q.resolve(eventSeries); };
  //   });
  //
  //   return q.promise;
  // };
 
  return self;
})

.factory('$sql_notes', function($sqlite, $q) {
  var self = this;
  
  self.add = function(value, time) {
    var q = $q.defer();
    var addNoteTime = (typeof time === "undefined") ? Math.floor(Date.now() / 1000) : time;
    
    console.log("Inserting Note: " + [addNoteTime, value.trim()]);
    $sqlite.query("INSERT INTO notes (time, value) VALUES (?, ?)", [addNoteTime, value.trim()])
      .then(function(value) {
        q.resolve(true);
      }, function(error) {
        q.reject(error);
      });
    
    return q.promise;
  }
  
  self.get = function(noteID) {
    var q = $q.defer();
    
    $sqlite.query("SELECT * FROM notes WHERE id=?", [noteID]).then(function(res){
      q.resolve($sqlite.getFirst(res));
    }, function(err) {
      q.reject(err);
    });
    
    return q.promise;
  };
  
  self.getAll = function() {
    var q = $q.defer();
    
    $sqlite.query("SELECT * FROM notes ORDER BY time DESC").then(function(res){
      q.resolve($sqlite.getAll(res));
    }, function(err) {
      q.reject(err);
    });
    
    return q.promise;
  }
  
  self.edit = function(noteID, value) {
    var q = $q.defer();
    
    $sqlite.query("UPDATE notes SET value=? WHERE id=?", [value, noteID]).then(function(res) {
      q.resolve(true);
    }, function(err) {
      q.reject(err);
    });
    
    return q.promise;
  }
  
  return self;
})

.factory('$sql_debug', function($q, $sqlite, $sql_events, $sql_notes) {
  var self = this;
  
  // Create Sample Data for Debugging
  self.createSampleDataset = function(numberSamples, numberDays) {
      var sampleData = [];
      var eventTypes = ["Mood", "Energy", "Libido", "Sex", "Fap"];
      var deltaTimestamp = 86400 * Math.floor(Math.random() * numberDays);
      var startTimestamp = Math.floor(Date.now() / 1000) - deltaTimestamp;
      var meanIncrement = Math.round(deltaTimestamp / numberSamples);

      for (var i = 0; i < numberSamples; i++) {
          var incrementVariance = Math.floor(Math.random() * 7201) - 3600;
          // Event Type
          var sampleEventType = Math.floor(Math.random() * 10);
          if (sampleEventType === 9) {
            sampleData.push($sql_events.add("Sex", null, startTimestamp + (meanIncrement * i) - incrementVariance));
          }
          else if (sampleEventType > 7 ) {
            sampleData.push($sql_events.add("Fap", null, startTimestamp + (meanIncrement * i) - incrementVariance));
          }
          else if (sampleEventType > 5) {
            sampleData.push($sql_notes.add("Lorem ipsum dolor sit amet, consetetur sadipscing elitr!", null, startTimestamp + (meanIncrement * i) - incrementVariance));
          }
          else {
            sampleData.push($sql_events.add("Mood", 1 + Math.floor(Math.random() * 5, startTimestamp + (meanIncrement * i) - incrementVariance)));
            sampleData.push($sql_events.add("Energy", 1 + Math.floor(Math.random() * 5, startTimestamp + (meanIncrement * i) - incrementVariance)));
            sampleData.push($sql_events.add("Libido", 1 + Math.floor(Math.random() * 5, startTimestamp + (meanIncrement * i) - incrementVariance)));
          }
      }
      return $q.all(sampleData);
  };


  
  return self;
})

.factory('$historyParser', function($q, $sqlite, $sql_events, $sql_notes) {
  var self = this;
  
  // Awesome History Parser
  self.getAwesome = function () {
    /* Concept of awesomeHistory:
    *  Different Time Deltas for Different Past Times!
    *  Time   | Delta
    *  < 10min  1min
    *  < 1h     10min
    *  < 12h    1h
    *  < 7d     1d
    *  >= 7d    Date
    *
    * Seperators are entered as type = "separator", timestamp
    * and value = "ago" or "date" (for Moment.js)
    */
    var q = $q.defer();
    
    $sql_events.getAll(null, null, "time").then(function(events) {
      console.log(JSON.stringify(events));
      // Preparation
      var awesomeHistory = []; // [type, timestamp, value] OR ["Data", timestamp, values[0-2]]
      var minute = 60; // One Minute is 60s, duh!
      var separatorsDelta = [60, 600, 3600, 86400, 86400];
      var triggerSeparators = [600, 3600, 43200, 518400];
      var separatorPosition = 0; // 0 - 4
      var dateDisplayMode = ["ago", "ago", "ago", "ago", "date"];
      var timestampNow = Math.floor(Date.now() / 1000);
      var lastTimestamp = timestampNow;
      var lastSeparated = timestampNow + 100;
    
      // Go through array, iterate backwards (newest first)
      for (var i = (events.length - 1); i >= 0; i--) {

        // Trigger Separator?
        if ((lastSeparated - events[i].time) > separatorsDelta[separatorPosition]) {
          awesomeHistory.push(["Separator", events[i].time, dateDisplayMode[separatorPosition]]);
          lastSeparated = events[i].time;
        }

        // Update Separator?
        if ((separatorPosition < triggerSeparators.length) && (timestampNow - events[i].time) > triggerSeparators[separatorPosition]) {
          separatorPosition++;
        }

        // Write History (Haha..)
        if (events[i].type === "Libido") {
          awesomeHistory.push(["Data", events[i].time, [events[i-2].value, events[i-1].value, events[i].value] ]); // mood, energy, libido
        }
        else if (events[i].type === "Sex" || events[i].type === "Fap") {
          awesomeHistory.push([events[i].type, events[i].time, null]);
        }

      }
      
      q.resolve(awesomeHistory);
    });
    
    return q.promise;
  };
  
  return self;
})

.factory('$statsParser', function() {
  var self = this;
  
  self.parseXAxisLinePlot = function(xdata, windowWidth) {
    // Settings
    var maxLabels = Math.floor(windowWidth / 5);
    var triggerFormat = [3600, 84000];
    var formats = ["minutes", "hours", "days"];
    
    // Action
    var xDelta = xdata[0] - xdata[xdata.length-1];
    if (xDelta < triggerFormat[0]) {
      // minutes
      
    }
    else if (xDelta < triggerFormat[1]) {
      // hours
    }
    else {
      // days
    }
  };
  
  return self;
})

.factory('$localNotifications', function($cordovaLocalNotification) {
  var self = this;
  
  self.setDailyReminder = function(setTo) {
    if (setTo === true) {
      return $cordovaLocalNotification.schedule({
        id: 1,
        title: 'How are you today?',
        text: 'Enter some Data to track your progress',
        every: 'day',
        led: '886aea' // LED Color for Android. NICE!
      }).then(function(result) {
        return result;
      }, function(error) {
        return error;
      });
    }
    else {
      $cordovaLocalNotification.cancelAll();
    };
  };
  
  return self;
})

.factory('$fapsperiment', function($q, $lsSettings, $firebaseObject, $sql_events) {
  var self = this;

  self.getUID = function() {
    var q = $q.defer();
    
    if ($lsSettings.get("fapsperiment_user") === "") {
      // No User, first Setup
      // Create User @ Firebase and get UID
      var now = Math.floor(Date.now() / 1000);
      var refUsers = new Firebase("https://nofapp.firebaseio.com/users");
      var refStats = new Firebase("https://nofapp.firebaseio.com/stats/users");
      var newUserRef = refUsers.push({
        "sex": $lsSettings.get("user_sex"),
        "since": now,
        "dob": $lsSettings.get("user_birthday")
      }, function(error) {
        if(error) {
          q.reject(error);
        }
        else {
          refStats.child("count").transaction(function (current_value) {
            return (current_value || 0) + 1;
          });
          refStats.child("count_sex_" + $lsSettings.get("user_sex")).transaction(function (current_value) {
            return (current_value || 0) + 1;
          });
          $lsSettings.set("fapsperiment_user", newUserRef.key());
          $lsSettings.set("fapsperiment_since", now);
          q.resolve(newUserRef.key());
        }
      });
    }
    else {
      // We have a User!
      q.resolve($lsSettings.get("fapsperiment_user"));
    }
    
    return q.promise;
  };
  
  self.sync = function() {
    var q = $q.defer();
    console.log("Fapsperiment Sync: Started");
    
    if ($lsSettings.is("fapsperiment")) {
      var refEvents = new Firebase("https://nofapp.firebaseio.com/events");
      var refStats = new Firebase("https://nofapp.firebaseio.com/stats/events");
      var syncStatus = [];
      // Get Events to push and push the shit put of them
      self.getUID().then(function(localUID) {
        $sql_events.getSync(0).then(function(res) {
          console.log("Fapsperiment Sync: Events to Sync: " + res.length);
          for (i = 0; i < res.length; i++) {
            syncStatus.push({
              id: res[i].id,
              key: refEvents.push({
                "debug_id": res[i].id,
                "uid": localUID,
                "time": res[i].time,
                "type": res[i].type,
                "value": res[i].value
                }).key()
            });
            refStats.child("count").transaction(function (current_value) {
              return (current_value || 0) + 1;
            });
            refStats.child("count_" + res[i].type).transaction(function (current_value) {
              return (current_value || 0) + 1;
            });
          }
          // Update Local Database with Sync Status
          var syncPromises = [];
          for (i = 0; i < syncStatus.length; i++) {
            if (syncStatus[i].key) {
              syncPromises.push($sql_events.setSync(syncStatus[i].id, 1));
              console.log("Fapsperiment Sync: Event Synced. Local ID: " + syncStatus[i].id + " Firebase Key: " + syncStatus[i].key);
            }
          }
          $q.all(syncPromises).then(function() {
            if (syncStatus.length > 0) {
              $lsSettings.set("fapsperiment_lastSync", Math.floor(Date.now() / 1000));
            }
            q.resolve(true);
          });
        }, function(err) {
          q.reject(err);
        });
      });
    }
    else {
      q.reject("Fapsperiment Sync: User is not taking part, not syncing");
    }
    
    return q.promise;
  };
  
  return self;
});