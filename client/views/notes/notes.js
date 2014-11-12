Template.notes.rendered = function () {
  $(window).resize(function () {
    $activeNote = $('.note.active');
    if ($activeNote.length > 0) {
      $activeNote.height($(window).height() - 98);
    }
  });
}

Template.notes.events({
  
  'click .build-note': function (e) {
    e.preventDefault();
    var kind = $(e.currentTarget).data('kind');
    Session.set('newNote', kind);
    Meteor.setTimeout( function () {
      var $currentTarget = $('#new-note .note');
      var pageTop = -$currentTarget.offset().top + 60
      $currentTarget.animate(
        {
          top: pageTop,
          left: -15,
          height: ($('#content').height()),
          width: $(window).width()
        }, 200, 'ease-out'
      );
      if (kind === 'note') {
        $currentTarget.find('textarea').focus();
      }else{
        $currentTarget.find('input').last().focus();
      }
      $('input, textarea').attr('tabindex', -1)
      $currentTarget.find('input, textarea').attr('tabindex', 1);
      
    }, 0);
  },
  
  'click .note:not(.active)': function (e) {
    if (!Session.get('note') && !Session.get('newNote')) {
      e.preventDefault();
      var $currentTarget = $(e.currentTarget);
      Session.set('note', this._id);
      var pageTop = -$currentTarget.offset().top + 60;
      $currentTarget.height($('#content').height());
      $currentTarget.animate(
        {
          top: pageTop,
          left: -15,
          width: $(window).width()
        }, 200, 'ease-out', function () {
          $('textarea').trigger('autosize.resizeIncludeStyle');
        }
      );
      
    }
  },
  
  'blur .note input:not(.task-input), blur .note textarea': function (e) {
    e.preventDefault();
    
    var noteAttributes = {
      title: $(e.target).closest('form').find('[name=title]').val(),
      content: $(e.target).closest('form').find('[name=content]').val(),
    }
    
    if (!noteAttributes.title && !noteAttributes.content) {
      console.log('error')
      return;
    }
    
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    
    if (newNote && _.contains(['note', 'list'], newNote)) {
      noteAttributes = _.extend(noteAttributes, { kind: newNote })
      
      Meteor.call('createNote', noteAttributes, function (error, noteId) {
        if (error) {
          console.log('error2')
          // throwError(error);
        }else{
          Session.set('newNote', noteId);
        }
      });
    }else{
      Meteor.call('updateNote', this._id, noteAttributes);
    }
  },
  
  'submit .create-task, blur .create-task': function (e) {
    console.log('submit .create-task, blur .create-task');
    e.preventDefault();
    
    var noteId = $(e.target).closest('.note').data('id');
    var newNote = Session.get('newNote');
    var errors = {};
    
    if (noteId) {
      var tasks = Tasks.find({noteId: noteId}).fetch();
      var position;
    
      if (tasks.length === 0) {
        position = 1;
      }else{
        position = _.min(
          _.map(tasks, function (task) {
            return task.position;
          })
        ) - 1;
      }
      
      var task = {
        noteId: this._id,
        content: $(e.target).find('[name=create]').val(),
        position: position
      }
      
      if (!task.content) {
        console.log('errors')
        return;
      }
      
      Meteor.call('createTask', task);
  
      $(e.target).find('[name=create]').val('');
    }
    
    
    if (newNote) {
      console.log('create note and new task');
      
      var note = {
        task: $(e.target).find('[name=create]').val()
      }
      
      if (!note.task) {
        console.log('error?')
        return;
      }
      
      Meteor.call('createNote', note, function (error, id) {
        if (error) {
          console.log('error2')
          // throwError(error);
        }else{
          $(e.target).find('[name=create]').val('');
          Session.set('newNote', id);
        }
      });
    }
    
  }
  
  // 'click #notes-list': function (e) {
  //   Session.set('archive', false);
  //   $('#notes-wrapper').removeClass('slide');
  // },
  
  // 'click #archive-list': function (e) {
  //   Session.set('archive', true);
  //   $('#notes-wrapper').removeClass('slide');
  // },
  
});

Template.notes.created = function () {
  Session.set('note', null);
  Session.set('newNote', null);
  Session.setDefault('archive', false);
};

currentNote = function () {
  return Session.get('note') || Session.get('newNote');
}

Template.notes.helpers({
  showNew: function () {
    var newNote = Session.get('newNote');
    return newNote ? 'show' : 'hide';
  },
  
  notes: function () {
    var search = Session.get('search');
    
    var noteIds = _.pluck(UserNotes.find({ accepted: true }).fetch(), 'noteId');
    var matchedIds = _.pluck(Tasks.find({ content: new RegExp(search, 'i') }).fetch(), 'noteId');
    
    var notes = Notes.find(
      { 
        _id: { $in: noteIds },
        archived: Session.get('archive'),
        $or: [
          { title: new RegExp(search, 'i') }, 
          { content: new RegExp(search, 'i') }, 
          { _id: { $in: matchedIds } }
        ]
      }, 
      { sort: { position: 1 } }
    );
    
    return notes;
  },
  
  noNotes: function () {
    var notesCount = Session.get('notesCount');
    return !notesCount || notesCount == 0;
  },
  
  search: function () {
    return Session.get('search');
  },
  
  newNote: function () {
    newNote = Session.get('newNote');
    if (newNote) {
      if (_.contains(['note', 'list'], newNote)) {
        return { kind: newNote };
      }else{
        return Notes.findOne(newNote);
      } 
    }
  },
  
  activeClass: function () {
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    if (note || newNote) {
      return 'active';
    }
  },

  archive: function () {
    return Session.get('archive');
  }
});

Meteor.active = function () {
  var note = Session.get('note');
  var newNote = Session.get('newNote');
  if ((!! note && this._id === note) || (newNote && !this._id)) {
    return true;
  }else{
    return false;
  }
}