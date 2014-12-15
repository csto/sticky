Template.note.rendered = function () {
  $('textarea').autosize({ append: false });
  var self = this;
  //
  // var drag;
  //
  // self.$('.note').on('mousedown', function (e) {
  //   drag = e.clientX;
  // });
  //
  // self.$('.note').on('mousedown', function (e) {
  //   if (e.clientX !== drag) {
  //     e.preventDefault();
  //   }
  // });
  //
  // self.$('.note').on('mouseup', function () {
  //   drag = false;
  // });
  
  // var start;
  //
  // self.$('.note').draggable({
  //   axis: 'x',
  //   // revert: true,
  //   distance: 5,
  //   scroll: false,
  //   start: function (event, ui) {
  //     start = ui.offset;
  //   },
  //   drag: function (event, ui) {
  //     console.log(ui)
  //     if (ui.offset.top < -10 || ui.offset.top > 10) {
  //       // return false;
  //     }
  //     var opacity = (100 - (ui.offset.left / 2)) / 100;
  //     opacity = opacity > 0.5 ? opacity : 0.5;
  //     self.$('.note').animate({ left: ui.offset.left, opacity: opacity }, 0);
  //   },
  //   stop: function (event, ui) {
  //     self.data.stop = true;
  //     if (ui.offset.left > 100 || ui.offset.left < -100) {
  //       if (this.archive) {
  //         Messages.insert({ content: 'Note unarchived.', undoId: note, call: 'updateNote', undo: { archived: true } });
  //       } else {
  //         Messages.insert({ content: 'Note archived.', undoId: note, call: 'updateNote', undo: { archived: false } });
  //       }
  //       Notes.update(self.data._id, { $set: { archived: !self.data.archived } });
  //
  //     } else {
  //       self.$('.note').animate({ left: 0, opacity: 1 }, 200);
  //     }
  //     if (ui.offset.left < 10 && ui.offset.left > -10) {
  //       Router.go('/notes/' + self.data._id);
  //     }
  //   }
  // });
  
  self.$('.note').hammer().on("swiperight", function(event) {
    alert('swiped')
  });
}


Template.note.events({
  // 'click .cover': function (e) {
  //   if (!Session.get('note') && !Session.get('newNote')) {
  //     e.preventDefault();
  //     $('#notes').removeClass('animatable');
  //     var $note = $(e.currentTarget).closest('.note');
  //     Session.set('note', this._id);
  //     var pageTop = -$note.offset().top + 60;
  //     $note.height($('#content').height());
  //     $note.animate(
  //       {
  //         top: pageTop,
  //         left: -10,
  //         width: $(window).width()
  //       }, 200, 'ease-out', function () {
  //         $('textarea').trigger('autosize.resizeIncludeStyle');
  //         $note.addClass('max');
  //       }
  //     );
  //   }
  // },
  
  'mouseup .note': function (e) {
    console.log(this.stop);
    if (!this.stop) {
      console.log('clicked note')
      Router.go('/notes/' + this._id);
    }
  },
  
  'change .task input, blur .task input, click #close-note': function (e) {
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


Template.note.helpers({
  shade: function () {
    if (this.color) {
      return this.color === '#fefefe' ? 'light' : 'dark';
    }
  },
  
  archive: function (parentContext) {
    return parentContext.archive;
  },
  
  showTitle: function () {
    return !! this.title;
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
    
    return Tasks.find({ noteId: this._id }, { sort: { position: -1, createdAt: 1 }, limit: 3 });
  },
  
  moreTasks: function () {
    return Tasks.find({ noteId: this._id }).count() > 3;
  },
  
  completedClass: function () {
    return this.completed ? 'completed' : '';
  }
});