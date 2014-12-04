Template.noteForm.rendered = function () {
  var self = this;
  $note = $('.note-animate [data-id=' + this.data._id + ']');
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
}

Template.noteForm.destroyed = function () {
  console.log('help');
  Session.set('note', null);
  Session.set('newNote', null);
  $note = $('.note-animate [data-id=' + this.data._id + ']');
  $('.note').removeClass('max');
  this.$('.note').animate({
    top: $note.offset().top - 60,
    left: 10,
    width: $note.outerWidth(),
    height: $note.outerHeight()
  }, 1000);
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