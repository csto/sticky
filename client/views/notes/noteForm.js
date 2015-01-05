Template.noteForm.rendered = function () {
  
  var self = this;
  
  // Session.set('note', Session.get('_id'));
  
  this.$('textarea').autosize({ append: false });

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

Template.noteForm.destroyed = function () {
  // Session.set('note', null);
}

Template.noteForm.events({
  'blur .note input:not(.task-input):not(.create-task-input), blur .note textarea, submit .active .active-form': function (e) {
    e.preventDefault();
    console.log('saving')
    
    // Session.set('saving', true);
    
    var noteAttributes = {
      title: $(e.target).closest('form').find('[name=title]').val(),
      content: $(e.target).closest('form').find('[name=content]').val(),
    }
    
    // Discard note with no title or content
    // if (!noteAttributes.title && !noteAttributes.content) {
    //   return Messages.insert({ content: 'Empty note discarded.' });
    // }
    
    // var note = Session.get('note');
    // var newNote = Session.get('newNote');
    //
    // if (newNote && _.contains(['note', 'list'], newNote)) {
    //   noteAttributes = _.extend(noteAttributes, { kind: newNote });
    //   Notes.insert({ kind: 'note' });
    //   // Meteor.call('createNote', noteAttributes, function (error, noteId) {
    //   //   if (error) {
    //   //     Messages.insert({ content: error.reason });
    //   //   }else{
    //   //     Session.set('newNote', noteId);
    //   //     if (Session.get('closing')) {
    //   //       Session.set('closing', null);
    //   //       closeNote();
    //   //     }
    //   //   }
    //   // });
    // }else{
    Notes.update(this._id, { $set: noteAttributes });
    // }
  },
  
  'submit .create-task, blur .create-task-input, click .create .fa-plus, click #close-note': function (e) {
    e.preventDefault();
    
    var noteId = $(e.target).closest('.note').data('id');
    // var newNote = Session.get('newNote');
    
    if (noteId) {
      var topTask = Tasks.findOne({noteId: noteId}, { sort: { position: 1 } });
      var position = !! topTask ? topTask.position - 1 : 0;
      
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
        } else {
          if (Session.get('closing')) {
            Session.set('closing', null);
            closeNote();
          }
        }
      });
  
      $('.create-task-input').val('');
    }
    
    
    // if (newNote && newNote === 'list') {
    //   var note = {
    //     task: $(e.target).find('[name=create]').val()
    //   }
    //
    //   if (!note.task) {
    //     return;
    //   }
    //
    //   Meteor.call('createNote', note, function (error, id) {
    //     if (error) {
    //       Messages.insert({ content: error.reason });
    //     }else{
    //       $(e.target).find('[name=create]').val('');
    //       Session.set('newNote', id);
    //     }
    //   });
    // }
    
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
    if (! this.color) {
      return 'light';
    }
    
    return this.color === '#fefefe' ? 'light' : 'dark';
  },
  
  kindMatches: function (kind) {
    return this.kind === kind;
  },
  
  tasks: function () {
    return Tasks.find({ noteId: this._id }, { sort: { position: -1, createdAt: 1 } });
  },
  
  timeInWords: function (time) {
    return moment(time).format('MMM Do');
  }
});

Template.task.helpers({
  // active: function (context) {
  //   if (context) {
  //     self = context;
  //   }
  //   // User currentNote() here
  //   // var note = Session.get('note');
  //   // var newNote = Session.get('newNote');
  //   return this._id === this.note;
  // },
  //
  // activeClass: function (context) {
  //   var self = this;
  //   if (context) {
  //     self = context;
  //   }
  //   // User currentNote() here
  //   var note = Session.get('note');
  //   var newNote = Session.get('newNote');
  //   if ((note && self._id === note) || ((newNote && !self._id) || (newNote === self._id))) {
  //     return 'active';
  //   }
  // }
});