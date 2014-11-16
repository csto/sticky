Template.note.rendered = function () {

  var self = this;
  
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
      Meteor.call('updateTask', Blaze.getData(el)._id, task);
    }
  });
}


Template.note.events({
  'click .cover': function (e) {
    if (!Session.get('note') && !Session.get('newNote')) {
      e.preventDefault();
      var $note = $(e.currentTarget).closest('.note');
      Session.set('note', this._id);
      var pageTop = -$note.offset().top + 60;
      $note.height($('#content').height());
      $note.animate(
        {
          top: pageTop,
          left: -15,
          width: $(window).width()
        }, 200, 'ease-out', function () {
          $('textarea').trigger('autosize.resizeIncludeStyle');
          $note.addClass('max');
        }
      );
    }
  },
  
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


Template.note.helpers({
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
    return this.completed ? 'completed' : '';
  }
});