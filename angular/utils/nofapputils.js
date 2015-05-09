// Angular Module for entering data into the database
// The most awesome DB Manager!
angular.module('nofapp.utils', ['ionic.utils'])

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
          else if (sampleEventType > 6 ) {
              sampleData.push(["relapse", startTimestamp + (meanIncrement * i) - incrementVariance]);
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
  
  // Read Database, create array and Sort
  // DEPRECATED --> this.addToDb
  this.getStructDbAndMelt = function() {
    var structDb = this.getStructDb();
    var structDbMelted = []
    
    // Get Mood and Energy
    for (i = 0; i < structDb.values.ts.length; i++) {
    structDbMelted.push(["mood", structDb.mood.ts[i], structDb.mood.val[i]]);
    structDbMelted.push(["energy", structDb.energy.ts[i], structDb.energy.val[i]]);
    }
    
    // Get Sex
    for (i = 0; i < structDb.had_sex.length; i++) {;
    structDbMelted.push(["had_sex", structDb.had_sex[i]]);
    }
    
    // Get Fap
    for (i = 0; i < structDb.had_sex.length; i++) {;
    structDbMelted.push(["relapsed", structDb.relapse[i]]);
    }
    
    structDbMelted.sort(function(a, b) {return b[1] - a[1]})
    
    // Convert Timestamps (rudimentary)
    /*
    for (i = 0; i < structDbMelted.length; i++) {
      structDbMelted[i][1] = NofappHelpers.timestampConverter(structDbMelted[i][1]);
    }
    */
    
    return structDbMelted;
  };
  
  // Awesome History Parser
  // TODO
  this.getHistoryAwesome = function () {
      // [type, timestamp, value(optional), displaytext]
      var awesomeHistory = [];
      var structDbMelted = this.getStructDbMelted();
      
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
  
  this.getFirstRun = function () {
    //var firstRun = NofappHelpers.isEmpty($localstorage.get('firstRun')) ? true : $localstorage.get('firstRun');
    //console.log("firstRun checked, result = " + firstRun);
    var firstRun = $localstorage.get("firstRun", "true");
    return firstRun;
  };
  
  this.setFirstRun = function(val) {
    // val = boolean, well not really, actually it's a string which is
  // either true or false, DUH
    $localstorage.set("firstRun", val);
    console.log("firstRun set to " + $localstorage.get("firstRun"));
  };
});
