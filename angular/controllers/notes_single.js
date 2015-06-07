angular.module('nofApp')
.controller('NotesSingleCtrl', function(noteData, $scope, $state, $sql_notes) {
  $scope.noteData = noteData;
  //console.log(noteID);
});