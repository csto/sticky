Template.noteForm.rendered = function () {
  var self = this;
  $note = $('.note-animate [data-id=' + this.data._id + ']');
  console.log($note);
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
      right: 0,
      bottom: 0
    });
  }, 0);
}

Template.noteForm.events({
  
});

Template.noteForm.helpers({
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