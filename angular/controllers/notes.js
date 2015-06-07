angular.module('nofApp')
.controller('NotesCtrl', function($scope, $state, $rootScope, $window, $ionicModal, $sql_notes, $ionicHistory) {
  $rootScope.$on('datasetChanged', function() {
    updateNoteList();
  });
  
  var updateNoteList = function() {
    $sql_notes.getAll().then(function(res) {
      $scope.noteList = res;
    });
  };
  updateNoteList();
  
  // Modal
  var windowHeight = $window.innerHeight;
  $scope.textareaHeight = windowHeight * 0.25;
  console.log("Window Height: " + windowHeight);
  
  $ionicModal.fromTemplateUrl('templates/sub/notes/modal_create.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal_notes_create = modal;
  });
  
  // Submit Function
  $scope.createNote = function(userNote) {
    var note = (typeof userNote.content === undefined) ? "" : userNote.content.trim();
    if (note.length > 0) {
      $sql_notes.add(note).then(function() {
        userNote.content = null;
        $scope.$emit('datasetChanged');
      
        // Super Hacky Fix to prevent missing Menu and Back Button after submitting form
        // https://github.com/driftyco/ionic/issues/1287
        $ionicHistory.currentView($ionicHistory.backView());
        
        $scope.modal_notes_create.hide();
        $ionicLoading.show({
          template: 'Note Saved.',
          duration: 2500
            });
      });
    };
  };
  
});