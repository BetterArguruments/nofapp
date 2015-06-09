angular.module('nofApp')
.controller('NotesSingleCtrl', function(noteData, $scope, $state, $window, $ionicModal, $ionicLoading, $ionicHistory, $sql_notes) {
  
  $scope.noteData = noteData;
  
  // Modal
  // We have to reinit because the contents change after the user has
  // edited a note repeatedly
  var windowHeight = $window.innerHeight;
  $scope.textareaHeight = windowHeight * 0.25;
  console.log("Window Height: " + windowHeight);
  
  var reinitModal = function() {
      $ionicModal.fromTemplateUrl('templates/sub/notes/modal_edit.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal_notes_edit = modal;
    });
  };
  reinitModal();
  
  // Submit Function
  $scope.note = { content: noteData.value };
  $scope.editNote = function(userNote) {
    var note = (typeof userNote.content === undefined) ? "" : userNote.content.trim();
    if (note.length > 0) {
      $sql_notes.edit(noteData.id, note).then(function() {
        //userNote.content = null;
        $scope.$emit('datasetChanged');
      
        // Reload?
        $scope.noteData.value = note;
        
        $scope.modal_notes_edit.hide();
        //$scope.modal_notes_edit.remove();
        //reinitModal();
      });
    };
  };
  
});