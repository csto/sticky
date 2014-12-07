Template.note.rendered = function () {

  
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


Template.note.helpers({
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