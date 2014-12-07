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
  
  'click .dropdown-toggle > a': function (e) {
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

      if (this.archive) {
        Messages.insert({ content: 'Note unarchived.', undoId: note, call: 'updateNote', undo: { archived: true } });
      } else {
        Messages.insert({ content: 'Note archived.', undoId: note, call: 'updateNote', undo: { archived: false } });
      }
      
      Notes.update(note._id, { $set: { archived: !note.archived } });
    }
  },

  'click #share': function (e) {
    if (_.contains(['note', 'list'], currentNote())) {
      e.preventDefault();
      $('.dropdown-menu').removeClass('active');
      Messages.insert({ content: "You can't share an empty note." });
    }
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
  $note = $('.note-animate [data-id=' + Session.get('note') + ']');
  $active = $('.note.active');
  Session.set('note', null);
  Session.set('newNote', null);
  $('.note').removeClass('max');
  if ($note.length > 0) {
    if (! $note.find('[name=title]').val()) {
      console.log('no title')
    }
    $active.animate({
      top: $note.offset().top - 60,
      left: 10,
      width: $note.outerWidth(),
      height: $note.outerHeight()
    }, 200, 'ease-out', function () {
      var query = '?archive=' + Session.get('archive');
      Router.go('/notes/' + query);
    });
  } else {
    var query = '?archive=' + Session.get('archive');
    Router.go('/notes/' + query);
  }
}
