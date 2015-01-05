// if id, close
// if no id, see if empty, then close, otherwise, set closing, call to server, unset closing and closeNote after save

// unsaved = function () {
//   var title = $('.active .title').val();
//   var content = $('.active .content').val();
//   console.log('unsaved')
//   return title || content;
// }
//


Template.note_header.events({
  'click #close-note ': function (e) {
    e.preventDefault();
    
    closeNote(this.note._id);
  },
  
  'click .dropdown-toggle > a': function (e) {
    $(e.currentTarget).next().toggleClass('active');
    return false;
  },
  
  'click .color': function (e, parent) {
    e.preventDefault();
    var color = $(e.currentTarget).data('color');
    Notes.update(parent.data.note._id, { $set: { color: color } });
  },

  'click #delete': function (e) {
    e.preventDefault();

    $('.dropdown-menu').removeClass('active');
    // closeNote();
    Meteor.call('deleteNote', this.note._id);
    Messages.insert({ content: 'Note deleted.' }); // undoId: note, call: 'updateNote', undo: { deletedAt: null }
    goBack();
  },
  
  'click #archive': function (e) {
    e.preventDefault();
    
    $('.dropdown-menu').removeClass('active');

    if (this.note.archived) {
      Messages.insert({ content: 'Note unarchived.', undoId: this.note._id, call: 'updateNote', undo: { archived: true } });
    } else {
      Messages.insert({ content: 'Note archived.', undoId: this.note._id, call: 'updateNote', undo: { archived: false } });
    }
    
    Notes.update(this.note._id, { $set: { archived: ! this.note.archived } });
    
    goBack();
  },

  // 'click #share': function (e) {
  //   if (_.contains(['note', 'list'], currentNote())) {
  //     e.preventDefault();
  //     $('.dropdown-menu').removeClass('active');
  //     Messages.insert({ content: "You can't share an empty note." });
  //   }
  // },

  'click #delete-completed': function (e) {
    // var noteId = Session.get('note');
    $('.dropdown-menu').removeClass('active');
    Messages.insert({ content: 'Completed tasks deleted.' })
    Meteor.call('deleteCompleted', this.note._id);
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
    var note = Notes.findOne(this.note);
    if (note) {
      return color === note.color;
    }
  },
  
  showHeader: function () {
    return this.note && ! Session.get('closing');
  },

  archive: function () {
    return Session.get('archive');
  },
  
  isList: function () {
    var note = Notes.findOne(this.note);
    if (note) {
      return note.kind === 'list';
    }
  }
});

empty = function () {
  var title = $('.active .title').val();
  var content = $('.active .content').val();
  var task = $('.active').find('.task').length > 0;
  return !title && !content && !task;
}

closeNote = function (noteId) {
  var $note = $('.note-animate [data-id=' + noteId + ']');
  var $active = $('.note.active');
  var title = $active.find('input[name=title]').val();
  var content = $active.find('.content').val();
  var task = $active.find('.task').length > 0;
  // Session.set('note', null);
  // Session.set('newNote', null);
  this.note = null
  Session.set('closing', true);
  $active.removeClass('max').addClass('shrink');
  $('textarea').trigger('autosize.resizeIncludeStyle');
  // if (!title && !content && !task) {
  //   Messages.insert({ content: 'Empty note discarded.' });
  //   Meteor.call('deleteNote', $note.data('id'));
  //   // Notes.remove($note.data('id'));
  //   $note.remove();
  //   $active.remove();
  //   goBack();
  // } else {
  if ($note.length > 0) {
    if (! $active.find('input[name=title]').val()) {
      $active.find('input[name=title]').hide();
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
  // }
  
}

goBack = function () {
  if (Session.get('archive')) {
    Router.go('/archive');
  } else {
    Router.go('/notes');
  }
}
