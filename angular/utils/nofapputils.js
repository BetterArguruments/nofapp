// Angular Module for entering data into the database
// The most awesome DB Manager!
angular.module('nofapp.utils', ['ionic.utils', 'ngCordova'])

.service('$db_query', function($localstorage, $cordovaSQLite, $rootScope) {
  // SQLite: Open Database
  this.sql_openDb = function() {
    console.log("SQLite: Database Open");
    $rootScope.db = $cordovaSQLite.openDB("nofapp.db");
  }
  
  // SQLite: Create initial table structure
  this.sql_initDb = function() {
    console.log("SQLite: Database Init with Values");
    
    // Check if tables exist (first run) and create if necessary
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS event_types (id integer primary key, name varchar(20))");
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS events (id integer primary key, type integer, time timestamp, value integer)");
    $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS notes (id integer primary key, linked_event integer, value text)");
    
    // Create Standard Event Types
    $cordovaSQLite.execute($rootScope.db, "INSERT INTO event_types (name) VALUES ('Mood')");
    $cordovaSQLite.execute($rootScope.db, "INSERT INTO event_types (name) VALUES ('Energy')");
    $cordovaSQLite.execute($rootScope.db, "INSERT INTO event_types (name) VALUES ('Libido')");
  };
  
  // Reset Database: Delete and Re-Create
  this.sql_resetDb = function() {
    console.log("SQLite: Deleting and re-creating database");
    $cordovaSQLite.deleteDB({name: "nofapp.db"});
    this.sql_openDb();
    this.sql_initDb();
  };
  
  this.sql_debug = function(table) {
    var query = "SELECT * FROM " + table;
    $cordovaSQLite.execute($rootScope.db, query).then(function(res) {
      console.log(JSON.stringify(res));
      console.log(res.rows.length);
      console.log(JSON.stringify(res.rows.item(0)));
      for (var i = 0; i < res.rows.length; i++) {
        console.log(JSON.stringify(res.rows.item(i)));
      }
    }, function(err) {
      console.log(err);
    });
  };
  
  this.sql_insertEvent = function (type, value, time) {
    console.log("Inserting new Row into Dataset");
    
    // Overload: Use timestamp of now (sql) of time is undefined
    var insert_time = (typeof time === "undefined") ? Math.floor(Date.now() / 1000) : time;
    
    // Get Type
    var insert_type = this.sql_getTypeIdByName(type);
    
    // The Value
    var insert_value = value;
    
    // Do the Query
    var query = "INSERT INTO events (type, time, value) VALUES (?, UNIX_TIMESTAMP(?), ?)";
    $cordovaSQLite.execute($rootScope.db, query, [insert_type, insert_time, insert_value]);
  };
  
  this.sql_insertUsualEvents = function (mood, energy, libido, time) {
    // Check if time is set, otherwise use now (Overload)
    var insert_time = (typeof time === "undefined") ? Math.floor(Date.now() / 1000) : time;

    this.sql_insertEvent("Mood", mood, insert_time);
    this.sql_insertEvent("Energy", energy, insert_time);
    this.sql_insertEvent("Libido", libido, insert_time);
  }
  
  this.sql_getTypeIdByName = function (typeName) {
    var query = "SELECT id FROM event_types WHERE (name == ?)";
    $cordovaSQLite.execute($rootScope.db, query, [typeName]).then(function(res) {
      return res.rows.item(0).id;
    }, function(err) {
      console.log(err);
      return false;
    });
  }
  
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
          else if (sampleEventType > 6 ) {
              sampleData.push(["fap", startTimestamp + (meanIncrement * i) - incrementVariance]);
          }
          else {
              sampleData.push(["mood", startTimestamp + (meanIncrement * i) - incrementVariance, 1 + Math.floor(Math.random() * 5)]);
              sampleData.push(["energy", startTimestamp + (meanIncrement * i) - incrementVariance, 1 + Math.floor(Math.random() * 5)]);
              sampleData.push(["libido", startTimestamp + (meanIncrement * i) - incrementVariance, 1 + Math.floor(Math.random() * 5)]);
          }
      }
      console.log(sampleData);
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
    $localstorage.set("firstRun", val)
    console.log("firstRun set to " + $localstorage.get("firstRun"));
  };
});