var NofappHelpers = {
  isEmpty: function(obj) {
    return Object.keys(obj).length === 0;
  },

  verbalizeNumber: function(i, words, has_infinite) {
    var k = i;
    if (typeof(has_infinite) === 'undefined') {has_infinite = false};
    if (has_infinite) {k++};
    if (k < words.length - 1) {
      return words[k];
    } else {
      return words[words.length - 1].replace("%d", i);
    };
  },
  
  timestampConverter: function (UNIX_timestamp) {
    var a = new Date(UNIX_timestamp*1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    //var time = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var time = date + '. ' + month;
    return time;
  }
};