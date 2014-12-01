Template.note_header.events({
  'click #close-note ': function (e) {
    e.preventDefault();
    $('#notes').addClass('animatable');
    
    var newNote = Session.get('newNote');

    if (newNote && (newNote === 'note' || newNote === 'list')) {
      Messages.insert({content: 'Empty note discarded.'});
    }
    
    closeNote();
  },
  
  'click .dropdown-toggle a': function (e) {
    $(e.currentTarget).next().toggleClass('active');
    return false;
  },

  'click #delete': function (e) {
    e.preventDefault();
    
    var noteId = Session.get('note');
    
    if (note) {
      $('.dropdown-menu').removeClass('active');
      Session.set('note', null);
      Meteor.call('deleteNote', noteId);
      Messages.insert({ content: 'Note deleted.' }); // undoId: note, call: 'updateNote', undo: { deletedAt: null }
    }
  },
  
  'click #archive': function (e) {
    e.preventDefault();
    
    var note = Notes.findOne(Session.get('note'));
    
    if (note) {
      $('.dropdown-menu').removeClass('active');
      closeNote();

      if (Session.get('archive')) {
        Messages.insert({ content: 'Note unarchived.', undoId: note, call: 'updateNote', undo: { archived: true } });
      } else {
        Messages.insert({ content: 'Note archived.', undoId: note, call: 'updateNote', undo: { archived: false } });
      }
      
      Meteor.call('updateNote', note._id, { archived: !note.archived });
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
    closeNote();
    $('#share-email').val('');
    $('.modal').modal('hide');
  },

  'click #delete-completed': function (e) {
    var noteId = Session.get('note');
    $('.dropdown-menu').removeClass('active');
    Messages.insert({ content: 'Completed tasks deleted.' })
    Meteor.call('deleteCompleted', noteId);
  }
});

Template.note_header.helpers({
  notePresent: function () {
    return currentNote() ? 'show' : '';
  },

  archive: function () {
    return Session.get('archive');
  },
  
  isList: function () {
    note = Notes.findOne(Session.get('note'));
    if (note) {
      return note.kind === 'list';
    }
  }
});

closeNote = function () {
  Session.set('note', null);
  Session.set('newNote', null);
  $('.note').removeClass('max').css({ top: 0, left: 0, width: 'auto', height: 'auto' });
  Meteor.setTimeout(function () {
    $('textarea').trigger('autosize.resizeIncludeStyle');
  }, 0); 
}
