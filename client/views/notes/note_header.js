// if id, close
// if no id, see if empty, then close, otherwise, set closing, call to server, unset closing and closeNote after save

emptyNote = function () {
  var title = $('.active .title').val();
  var content = $('.active .content').val();
  return !title && !content;
}

Template.note_header.events({
  'click #close-note ': function (e) {
    e.preventDefault();
    console.log('closing');
    $('#notes').addClass('animatable');
    
    var newNote = Session.get('newNote');
    
    if (!$('.active').title && !noteAttributes.content ) {
      return Messages.insert({ content: 'Empty note discarded.' });
    }
    
    if (newNote && (newNote === 'note' || newNote === 'list')) {
      if (emptyNote()) {
      
      } else {
        
      }
    }
    
    closeNote();
  },
  
  'click .dropdown-toggle > a': function (e) {
    $(e.currentTarget).next().toggleClass('active');
    return false;
  },
  
  'click .color': function (e) {
    e.preventDefault();
    var color = $(e.currentTarget).data('color');
    Notes.update(currentNote(), { $set: { color: color } });
  },

  'click #delete': function (e) {
    e.preventDefault();
    
    var noteId = Session.get('note');
    
    if (noteId) {
      $('.dropdown-menu').removeClass('active');
      Session.set('note', null);
      closeNote();
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

  'click #delete-completed': function (e) {
    var noteId = Session.get('note');
    $('.dropdown-menu').removeClass('active');
    Messages.insert({ content: 'Completed tasks deleted.' })
    Meteor.call('deleteCompleted', noteId);
  }
});

Template.note_header.helpers({
  colors: function () {
    var note = Notes.findOne(Session.get('note'));
    return [
      '#fefefe',
      '#c54657',
      '#d1694a',
      '#d1904a',
      // '#d1ab4a',
      '#d1c54a',
      '#b8c847',
      '#67bb43',
      '#41b691',
      '#4182b6',
      '#4149b6',
      '#7641b6',
      '#b741a7'
    ];
  },
  
  activeColor: function (color) {    
    var note = Notes.findOne(Session.get('note'));
    if (note) {
      return color === note.color;
    }
  },
  
  notePresent: function () {
    return currentNote() ? 'show' : '';
  },

  archive: function () {
    return Session.get('archive');
  },
  
  isList: function () {
    var note = Notes.findOne(Session.get('note'));
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
    if (! $active.find('[name=title]').val()) {
      $active.find('[name=title]').hide();
    }
    $active.animate({
      top: $note.offset().top - 60,
      left: 10,
      width: $note.outerWidth(),
      height: $note.outerHeight()
    }, 200, 'ease-out', function () {
      goBack();
    });
  } else {
    goBack();
  }
}

goBack = function () {
  if (Session.get('archive')) {
    Router.go('/archive');
  } else {
    Router.go('/notes');
  }
}
