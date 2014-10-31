Template.notes.events({
  'click #notes-wrapper': function (e) {
    e.preventDefault();
    if ($(e.currentTarget).hasClass('slide')) {
      $(e.currentTarget).toggleClass('slide');
      return false;
    }
  },
  
  'keyup #search': function (e) {
    if (Meteor.isClient) {
      Session.set('search', $(e.target).val())
    }
  },
  
  'click #searchButton': function (e) {
    $('#searchForm').show();
    $('#searchForm input').focus();
  },
  
  'click #build-note': function (e) {
    e.preventDefault();
    var kind = $(e.target).data('kind');
    Session.set('newNote', kind);
    setTimeout( function () {
      var $currentTarget = $('#new-note .note');
      var pageTop = -$currentTarget.offset().top + 60
      $currentTarget.animate(
        {
          top: pageTop,
          left: -15,
          height: ($('#content').height() -40),
          width: $currentTarget.width() + 30
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
      var id = $currentTarget.data('id');
      Session.set('note', id);
      $(e.target).blur();
      var pageTop = -$currentTarget.offset().top + 60
      $currentTarget.height($currentTarget.height());
      
      $currentTarget.animate(
        {
          top: pageTop,
          left: -15,
          height: ($('#content').height() -40),
          width: $currentTarget.width() + 30
        }, 200, 'ease-out'
      );
    }
  },
  
  'blur .note input:not(.task-input), blur .note textarea': function (e) {
    console.log('blur .note input / textarea')
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
    
    if (newNote) {
      if (_.contains(['note', 'list'], newNote)) {
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
        Notes.update(newNote, { $set: noteAttributes });
      }
    }else{
      Notes.update(note, { $set: noteAttributes });
    }

  },
  
  'click #close-note ': function (e) {
    e.preventDefault();
    if (newNote && (newNote === 'note' || newNote === 'list')) {
      Messages.insert({content: 'Empty note discarded.'});
    }
    Session.set('note', null);
    Session.set('newNote', null);
    $('input, textarea').prop('disabled', false);
    $('.note').css({ top: 0, left: 0, width: 'auto', height: 'auto' });
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
    
  },
  
  'change .task input, blur .task input': function (e) {
    e.preventDefault();

    var task = {
      content: $(e.target).closest('form').find('[name=content]').val(),
      completed: $(e.target).closest('form').find('[name=completed]').prop('checked')
    }

    Meteor.call('updateTask', this._id, task);
  },
  
  'focus .task input': function (e) {
    e.preventDefault();
    $(e.target).parent().find('.delete').show();
  },
  
  'click .delete': function (e) {
    Tasks.remove(this._id);
  },
  
  'click #dropdown-toggle': function (e) {
    e.preventDefault();
    $(e.currentTarget).next().toggleClass('active');
  },
  
  'click #delete': function (e) {
    e.preventDefault();
    var note = Session.get('note');
    if (note) {
      Session.set('note', null);
      Notes.remove({ _id: note });
      Messages.insert({content: 'Note deleted.'});
      
    }
  },
  
  'click #archive': function (e) {
    e.preventDefault();
    var note = Session.get('note');
    if (note) {
      Session.set('note', null);
      Meteor.call('archive', note);
      Messages.insert({content: 'Note archived.'});
    }
  },
  
  'click #menu': function (e) {
    e.preventDefault();
    console.log('menuclick')
    $('#notes-wrapper').toggleClass('slide');
    return false;
  },
  
  'click #notes-list': function (e) {
    Session.set('archive', false);
    $('#notes-wrapper').removeClass('slide');
  },
  
  'click #archive-list': function (e) {
    Session.set('archive', true);
    $('#notes-wrapper').removeClass('slide');
  },
  
  'click #share': function (e) {
    e.preventDefault();
    var email = 'coreystout@gmail.com';
    Meteor.call('share', Session.get('note') || Session.get('newNote'), email);
  },
  
  // 'keyup textarea': function (e) {
  //   $textarea = $(e.target);
  //   $textarea.height($textarea[0].scrollHeight);
  // }
});

Template.notes.created = function () {
  Session.set('note', null);
  Session.set('newNote', null);
  Session.set('archive', false)
};

currentNote = function () {
  return Session.get('note') || Session.get('newNote');
}

Template.notes.helpers({
  showNew: function () {
    var newNote = Session.get('newNote');
    return newNote ? 'show' : 'hide';
  },
  
  notePresent: function () {
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    return (note || newNote) ? 'show' : 'hide';
  },
  
  notes: function () {
    var search = Session.get('search');
    return Notes.find(
      { 
        archived: Session.get('archive'),
        $or: [
          { title: new RegExp(search, 'i') }, 
          { content: new RegExp(search, 'i') }, 
          { tasks: { $elemMatch: { content: new RegExp(search, 'i') } } }
        ]
      }, 
      { sort: { position: 1 } }
    );
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
  var self = this;
  self.$('.tasks').sortable({
    axis: 'y',
    handle: '.fa-bars',
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
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    return ((note && self._id === note) || ((newNote && !self._id) || (newNote === self._id)));
  },
  
  activeClass: function (context) {
    var self = this;
    if (context) {
      self = context;
    }
    var note = Session.get('note');
    var newNote = Session.get('newNote');
    if ((note && self._id === note) || ((newNote && !self._id) || (newNote === self._id))) {
      return 'active';
    }
  },
  
  note: function () {
    if (!! Session.get('note')) {
      return Session.get('note');
    }
  },
  
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

Template.message.rendered = function() {
	  var message = this.data;
	  Meteor.setTimeout(function () {
    Messages.remove(message._id);
  }, 3000);
};

Template.messages.helpers({
  messages: function () {
    return Messages.find();
  }
});