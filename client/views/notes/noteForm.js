Template.noteForm.rendered = function () {
  
  var self = this;
  Session.set('note', Session.get('_id'));
  
  this.$('textarea').autosize({ append: false });
  
  // self.$('.note').draggable({
  //   axis: 'x',
  //   revert: true,
  //   drag: function (event, ui) {
  //     var opacity = (100 - (ui.offset.left / 2)) / 100;
  //     opacity = opacity > 0.5 ? opacity : 0.5;
  //     self.$('.note').animate({ left: ui.offset.left, opacity: opacity }, 0);
  //   },
  //   stop: function (event, ui) {
  //
  //     if (ui.offset.left > 100) {
  //       var note = self.$('.note').data('id');
  //       Session.set('note', null);
  //
  //       Meteor.call('archive', note, function (error) {
  //         return false;
  //       });
  //       if (Session.get('archive')) {
  //         Messages.insert({ content: 'Note unarchived.', undoId: note, call: 'updateNote', undo: { archived: true } });
  //       } else {
  //         Messages.insert({ content: 'Note archived.', undoId: note, call: 'updateNote', undo: { archived: false } });
  //       }
  //
  //     } else {
  //       self.$('.note').animate({ left: 0, opacity: 1 }, 200);
  //     }
  //   }
  // });

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
      Tasks.update(Blaze.getData(el)._id, { $set: task });
    }
  });
  
  $note = $('.note-animate [data-id=' + this.data._id + ']');
  if ($note.length > 0) {
    this.$('.note').css({
      top: $note.offset().top - 60,
      left: 10,
      width: $note.outerWidth(),
      height: $note.outerHeight()
    });
    
    Meteor.setTimeout(function () {    
      self.$('.note').animate({
        top: 0,
        left: 0,
        width: $(window).width(),
        height: $(window).height() - 60
      }, 200, function () {
      self.$('.note').addClass('max');
    });
    }, 0);
  } else {
    self.$('.note').addClass('max');
  }
  
  
  
}

Template.noteForm.events({
  'submit .create-task, blur .create-task-input, click .create .fa-plus': function (e) {
    e.preventDefault();
    
    var noteId = $(e.target).closest('.note').data('id');
    var newNote = Session.get('newNote');
    
    if (noteId) {
      var topTask = Tasks.findOne({noteId: noteId}, { sort: { position: 1 } });
      var position = topTask.position - 1 || 0;
      
      var task = {
        noteId: this._id,
        content: $('.create-task-input').val(),
        position: position
      }
      
      if (!task.content) {
        return;
      }
      
      Meteor.call('createTask', task, function (error) {
        if (error) {
          Messages.insert({ content: error.reason });
        }
      });
  
      $('.create-task-input').val('');
    }
    
    
    if (newNote && newNote === 'list') {
      var note = {
        task: $(e.target).find('[name=create]').val()
      }
      
      if (!note.task) {
        return;
      }
      
      Meteor.call('createNote', note, function (error, id) {
        if (error) {
          Messages.insert({ content: error.reason });
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
      content: $(e.target).closest('form').find('[name=content]').val()
    }

    Tasks.update(this._id, { $set: task });
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

    Tasks.update(this._id, { $set: task });
  }
});

Template.noteForm.helpers({
  shade: function () {
    return this.color === '#fefefe' ? 'light' : 'dark';
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
    
    return Tasks.find({ noteId: this._id }, { sort: { position: -1, createdAt: 1 } });
  },
  
  timeInWords: function (time) {
    return moment(time).format('MMM Do');
  }
});

Template.task.helpers({
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
  }
});