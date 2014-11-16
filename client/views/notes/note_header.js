closeNote = function () {
  Session.set('note', null);
  Session.set('newNote', null);
  $('.note').removeClass('max').css({ top: 0, left: 0, width: 'auto', height: 'auto' });
  Meteor.setTimeout(function () {
    $('textarea').trigger('autosize.resizeIncludeStyle');
  }, 0); 
}

Template.note_header.events({
  'click #close-note ': function (e) {
    e.preventDefault();
    
    var newNote = Session.get('newNote');

    if (newNote && (newNote === 'note' || newNote === 'list')) {
      Messages.insert({content: 'Empty note discarded.'});
    }
    
    closeNote();
  },
  
  'click .dropdown-toggle': function (e) {
    $(e.currentTarget).next().toggleClass('active');
    return false;
  },

  'click #delete': function (e) {
    e.preventDefault();
    
    var note = Session.get('note');
    
    if (note) {
      $('.dropdown-menu').removeClass('active');
      Session.set('note', null);
      Notes.remove({ _id: note });
      Messages.insert({content: 'Note deleted.' }); // undoId: note, call: 'updateNote', undo: { deletedAt: null }
    }
  },
  
  'click #archive': function (e) {
    e.preventDefault();
    
    var note = Session.get('note');
    
    if (note) {
      $('.dropdown-menu').removeClass('active');
      closeNote();

      if (Session.get('archive')) {
        Messages.insert({ content: 'Note unarchived.', undoId: note, call: 'updateNote', undo: { archived: true } });
      } else {
        Messages.insert({ content: 'Note archived.', undoId: note, call: 'updateNote', undo: { archived: false } });
      }
      
      Meteor.call('archive', note);
    }
  },

  'click #share': function (e) {
    e.preventDefault();
    
    $('.dropdown-menu').removeClass('active');
    $('.modal').modal('show');  
  },

  'click #send-share': function (e) {
    var email = $('#share-email').val();
    // validate email in call, error if invalid email or share token exists

    Meteor.call('sendShare', currentNote(), email);
    $('#share-email').val('');
    $('.modal').modal('hide');
  }
});

Template.note_header.helpers({
  notePresent: function () {
    return currentNote() ? 'show' : '';
  },

  archive: function () {
    return Session.get('archive');
  }
});