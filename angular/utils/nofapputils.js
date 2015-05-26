// Angular Module for entering data into the database
// The most awesome DB Manager!
angular.module('nofapp.utils', ['ionic.utils', 'ngCordova'])

.service('$db_query', function($localstorage) {
  // Initial Dataset for localStorage Database.
  this.getInitialDataset = function() {
      return [];
  };

  // Create Sample Data for Debugging
  this.createSampleDataset = function(numberSamples, numberDays) {
      var sampleData = [];
      var eventTypes = ["mood", "energy", "libido", "sex", "fap"];
      var deltaTimestamp = 86400 * Math.floor(Math.random() * numberDays);
      var startTimestamp = Math.floor(Date.now() / 1000) - deltaTimestamp;
      var meanIncrement = Math.round(deltaTimestamp / numberSamples);

      for (var i = 0; i < numberSamples; i++) {
          var incrementVariance = Math.floor(Math.random() * 7201) - 3600;
          // Event Type
          var sampleEventType = Math.floor(Math.random() * 10);
          if (sampleEventType === 9) {
            sampleData.push(["sex", startTimestamp + (meanIncrement * i) - incrementVariance]);
          }
          else if (sampleEventType > 7 ) {
            sampleData.push(["fap", startTimestamp + (meanIncrement * i) - incrementVariance]);
          }
          else if (sampleEventType > 5) {
            sampleData.push(["note", startTimestamp + (meanIncrement * i) - incrementVariance, "HELLO WORLD!"]);
          }
          else {
            sampleData.push(["mood", startTimestamp + (meanIncrement * i) - incrementVariance, 1 + Math.floor(Math.random() * 5)]);
            sampleData.push(["energy", startTimestamp + (meanIncrement * i) - incrementVariance, 1 + Math.floor(Math.random() * 5)]);
            sampleData.push(["libido", startTimestamp + (meanIncrement * i) - incrementVariance, 1 + Math.floor(Math.random() * 5)]);
          }
      }
      
      //console.log(sampleData);
      $localstorage.setObject("struct", sampleData);
  }

  // Read Database
  this.getStructDb = function() {
    console.log("Reading Database...");
    var structDb = $localstorage.getObject('struct');
    // Check for empty DB. Actually, this shouldn't happen
    // as the user should have entered some data already at this point
    if (NofappHelpers.isEmpty(structDb)) {
      console.log("structDb is empty. Initializing. This shouldn't have happened.")
      structDb = this.getInitialDataset();
      console.log("Wrote initial Dataset.");
    };
    return structDb;
  };

  this.getLastFap = function () {
    var structDb = this.getStructDb();
    for (var i = structDb.length - 1; i >= 0; i--) {
      if (structDb[i][0] === "fap") {
        return structDb[i][1];
      }
    }
    return false;
  }

  // Awesome History Parser
  this.getHistoryAwesome = function () {
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

      // Get DB
      var structDb = this.getStructDb();

      // Preparation
      var awesomeHistory = []; // [type, timestamp, value] OR ["concatData", timestamp, values[0-2]]
      var minute = 60; // One Minute is 60s, duh!
      var separatorsDelta = [60, 600, 3600, 86400, 86400];
      var triggerSeparators = [600, 3600, 43200, 518400];
      var separatorPosition = 0; // 0 - 4
      var dateDisplayMode = ["ago", "ago", "ago", "ago", "date"];
      var timestampNow = Math.floor(Date.now() / 1000);
      var lastTimestamp = timestampNow;
      var lastSeparated = timestampNow + 100;

      // Go through array, iterate backwards (newest first)
      for (var i = (structDb.length - 1); i >= 0; i--) {

        // Trigger Separator?
        if ((lastSeparated - structDb[i][1]) > separatorsDelta[separatorPosition]) {
          awesomeHistory.push(["separator", structDb[i][1], dateDisplayMode[separatorPosition]]);
          lastSeparated = structDb[i][1];
        }

        // Update Separator?
        if ((separatorPosition < triggerSeparators.length) && (timestampNow - structDb[i][1]) > triggerSeparators[separatorPosition]) {
          separatorPosition++;
        }

        // Write History (Haha..)
        if (structDb[i][0] === "libido") {
          awesomeHistory.push(["concatData", structDb[i][1], [structDb[i-2][2], structDb[i-1][2], structDb[i][2]]]); // mood, energy, libido
        }
        else if (structDb[i][0] === "sex" || structDb[i][0] === "fap") {
          awesomeHistory.push([ structDb[i][0], structDb[i][1] ]);
        }
        else if (structDb[i][0] === "note") {
          awesomeHistory.push([ structDb[i][0], structDb[i][1], structDb[i][2]]);
        }
        // else (structDb[i][0] === "mood" || structDb[i][0] === "energy")

        // Update lastTimestamp
        //lastTimestamp = structDb[i][1];

      }

      return awesomeHistory;
  };

  // The all-in-one Database Add Method
  this.addToDb = function(type, value, time) {
      // Check if time is set, otherwise use now (Overload)
      var timestamp = (typeof time === "undefined") ? Math.floor(Date.now() / 1000) : time;

      // Read Database
      console.log("Reading Struct from DB...");
      var structDb = $localstorage.getObject('struct');

      // Check if DB is empty and initialize
      if (NofappHelpers.isEmpty(structDb)) {
        console.log("structDb is empty. Initializing.")
        structDb = this.getInitialDataset();
        console.log("Wrote initial Dataset.");
      };

      // Write to Array
      structDb.push([type, timestamp, value]);

      // Write to localStorage
      $localstorage.setObject("struct", structDb);
      console.log("Wrote Struct to DB.");
  }

  this.addUsualDataToDb = function(mood, energy, libido, time) {
      // Check if time is set, otherwise use now (Overload)
      var timestamp = (typeof time === "undefined") ? Math.floor(Date.now() / 1000) : time;

      this.addToDb("mood", mood, timestamp);
      this.addToDb("energy", energy, timestamp);
      this.addToDb("libido", libido, timestamp);
  }

  this.resetDb = function() {
    var structDb = this.getInitialDataset();
    $localstorage.setObject("struct", structDb);
    console.log("Database Reset.");
  };

  this.isFirstRun = function () {
    var firstRun = $localstorage.get("firstRun", "true");
    if (firstRun === "false") {
      return false;
    } else {
      return true;
    };
  };

  this.firstRunDone = function() {
    $localstorage.set("firstRun", "false");
  };

  this.setFirstRun = function(val) {
    // val = boolean, well not really, actually it's a string which is
  // either true or false, DUH
    if (val === "done") {
      $localstorage.set("firstRun", "done");
    }
    else if (val === "not_done") {
      $localstorage.set("firstRun", "not_done");
    }
    else {
      console.log("setFirstRun Error!");
    }
    console.log("firstRun set to " + $localstorage.get("firstRun"));
  };
})


.factory('$firstRunCheck', function($localstorage) {
  this.isFirstRun = function () {
    var firstRun = $localstorage.get("firstRun", "true");
    if (firstRun === "false") {
      return false;
    } else {
      return true;
    };
  };
  
  this.setFirstRun = function(val) {
    // val = boolean, well not really, actually it's a string which is
    // either true or false, DUH
    $localstorage.set("firstRun", val)
    console.log("firstRun set to " + $localstorage.get("firstRun"));
  };
  
  return this;
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

.factory('$sql_init', function($sqlite, $q, $cordovaAppVersion, $localstorage, $sql_events, $sql_notes) {
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
    console.log(JSON.stringify(structDb));

    self.getTables().then(function(tableCount) {
      console.log("SQLite Init: SQLite Table Count: " + tableCount.length);
      
      if (tableCount.length !== 0) {
        console.log("SQLite Init: Stopped, found " + tableCount.length + "SQLite Tables");
        q.resolve(true);
      }
      else {
        console.log("SQLite Init: No SQLite Tables found. Creating initial Tables and starting Upgrader");
        self.createInitialTables()
        .then(function() {
          self.insertInitialData()
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
  
  // Database Upgrader
  self.upgrade = function() {
    var q = $q.defer();
    var structDb = $localstorage.getObject('struct');
    
    $cordovaAppVersion.getAppVersion().then(function(appVersion) {
      if (appVersion === "0.0.2") {
        if ((typeof structDb !== "undefined") && structDb.length > 0) {
          // User has old Data, Migrate 1 -> 2
          console.log("Updater: Found old localstorage Data, starting Migration 1 -> 2");
          self.upgrade_from_1_to_2().then(function() {
            q.resolve("Upgrade complete");
          });
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
    
    //$sql_notes.addNote("HELLO", 1432679581);
    
    for (var i = 0; i < structDb.length; i++) {
      switch(structDb[i][0]) {
      case "mood":
        promises.push($sql_events.addEvent("Mood", structDb[i][2], structDb[i][1]));
        break;
      case "energy":
        promises.push($sql_events.addEvent("Energy", structDb[i][2], structDb[i][1]));
        break;
      case "libido":
        promises.push($sql_events.addEvent("Libido", structDb[i][2], structDb[i][1]));
        break;
      case "sex":
        promises.push($sql_events.addEvent("Sex", null, structDb[i][1]));
        break;
      case "fap":
        promises.push($sql_events.addEvent("Fap", null, structDb[i][1]));
        break;
      case "note":
        promises.push($sql_notes.addNote(structDb[i][2], structDb[i][1]));
        break;
      }
    }
    
    // Delete localstorage
    $localstorage.set("struct","");
    
    console.log("Migrating " + structDb.length + " localstorage Entries to " + promises.length + " SQLite Entries");
    return $q.all(promises);
  };

  return self;
})

.factory('$sql_events', function($sqlite, $q) {
  // https://gist.github.com/borissondagh/29d1ed19d0df6051c56f
  var self = this;
 
  self.getEventTypeIdByName = function(eventName) {
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
  };
  
  self.addEvent = function(type, value, time) {
    var q = $q.defer();
    
    // Get Timestamp(now) if undefined
    var addEventTime = (typeof time === "undefined") ? Math.floor(Date.now() / 1000) : time;
    
    // Set Value = null if undefined (e.g. for Sex and Fap)
    var addEventValue = (typeof value === "undefined") ? null : value;
    
    self.getEventTypeIdByName(type)
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
 
  self.all = function() {
    return $sqlite.query("SELECT id, name FROM team")
      .then(function(result){
        return $sqlite.getAll(result);
      });
  }
 
  self.get = function(memberId) {
    var parameters = [memberId];
    return $sqlite.query("SELECT id, name FROM team WHERE id = (?)", parameters)
      .then(function(result) {
        return $sqlite.getById(result);
      });
  }
 
  self.add = function(member) {
    var parameters = [member.id, member.name];
    return $sqlite.query("INSERT INTO team (id, name) VALUES (?,?)", parameters);
  }
 
  self.remove = function(member) {
    var parameters = [member.id];
    return $sqlite.query("DELETE FROM team WHERE id = (?)", parameters);
  }
 
  self.update = function(origMember, editMember) {
    var parameters = [editMember.id, editMember.name, origMember.id];
    return $sqlite.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
  }
 
  return self;
})

.factory('$sql_notes', function($sqlite, $q) {
  self.addNote = function(value, time) {
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
  
  return self;
});