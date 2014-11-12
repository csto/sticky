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

Template.note_item.events({
  'change .task input, blur .task input': function (e) {
    e.preventDefault();

    var task = {
      content: $(e.target).closest('form').find('[name=content]').val()
    }

    Meteor.call('updateTask', this._id, task);
  },
  
  'focus .task input': function (e) {
    e.preventDefault();
    $('.delete').hide();
    $(e.target).parent().find('.delete').show();
  },
  
  'click .task .delete': function (e) {
    Tasks.remove(this._id);
  },

  'click .task .fa-check-square, click .task .fa-square-o': function (e) {
    e.preventDefault();
    
    var task = {
      completed: !this.completed
    }

    Meteor.call('updateTask', this._id, task);
  }
});

Template.notes.created = function () {
  Session.set('note', null);
  Session.set('newNote', null);
  Session.set('archive', false);
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
    
    var noteIds = _.pluck(Tasks.find({ content: new RegExp(search, 'i') }, {  _id: 1 } ).fetch(), 'noteId');
    
    var notes = Notes.find(
      { 
        archived: Session.get('archive'),
        $or: [
          { title: new RegExp(search, 'i') }, 
          { content: new RegExp(search, 'i') }, 
          { _id: { $in: noteIds } }
        ]
      }, 
      { sort: { position: 1 } }
    );
    
    Session.set('notesCount', notes.count());
    return notes;
  },
  
  noNotes: function () {
    var notesCount = Session.get('notesCount');
    return !notesCount || notesCount == 0;
  },
  
  search: function () {
    return Session.get('search');
  },
  
  archive: function () {
    return Session.get('archive');
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

Template.note_item.rendered = function () {
  
  $('textarea').autosize();
  
  var self = this;
  
  // $(this.firstNode).closest('.note-animate').removeClass('animate');
  self.$('.tasks').sortable({
    axis: 'y',
    handle: '.fa-bars',
    placeholder: 'task-placeholder',
    stop: function(e, ui) {
      // get the dragged html element and the one before
      //   and after it
      el = ui.item.get(0)
      before = ui.item.prev().get(0)
      after = ui.item.next().get(0)

      // Here is the part that blew my mind!
      //  Blaze.getData takes as a parameter an html element
      //    and will return the data context that was bound when
      //    that html element was rendered!
      if(!before) {
        //if it was dragged into the first position grab the
        // next element's data context and subtract one from the rank
        position = Blaze.getData(after).position + 1
      } else if(!after) {
        //if it was dragged into the last position grab the
        //  previous element's data context and add one to the rank
        position = Blaze.getData(before).position - 1
      }
      else
        //else take the average of the two ranks of the previous
        // and next elements
        position = (Blaze.getData(after).position +
                   Blaze.getData(before).position)/2

      //update the dragged Item's rank
      var task = {
        position: position
      }
      Meteor.call('updateTask', Blaze.getData(el)._id, task);
    }
  });
}

Template.note_item.helpers({
  active: function (context) {
    var self = this;
    if (context) {
      self = context;
    }
    // User currentNote() here
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    return ((note && self._id === note) || ((newNote && !self._id) || (newNote === self._id)));
  },
  
  activeClass: function (context) {
    var self = this;
    if (context) {
      self = context;
    }
    // User currentNote() here
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    if ((note && self._id === note) || ((newNote && !self._id) || (newNote === self._id))) {
      return 'active';
    }
  },
  
  showTitle: function () {
    return this.title || currentNote() === this._id || currentNote() === 'note' || currentNote() === 'list';
  },
  
  // note: function () {
  //   if (!! Session.get('note')) {
  //     return Session.get('note');
  //   }
  // },
  
  kindMatches: function (kind) {
    var note = Session.get('note');
    if (note === 'new') {
      return Session.get('kind') === kind;
    }else{
      return this.kind === kind;
    }
  },
  
  tasks: function () {
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    var limit;
    if ((note && this._id === note) || ((newNote && !this._id) || (newNote === this._id))) {
      limit = 0;
    }else{
      limit = 3;
    }
    
    return Tasks.find({ noteId: this._id }, { sort: { position: -1, createdAt: 1 }, limit: limit });
  },
  
  moreTasks: function () {
    return Tasks.find({ noteId: this._id }).count() > 3;
  },
  
  timeInWords: function (time) {
    return moment(time).format('MMM Do');
  },
  
  completedClass: function () {
    return this.completed ? 'completed' : ''
  }
});

