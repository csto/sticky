Template.share.events({
  'submit #send-share': function (e) {
    e.preventDefault();
    
    var self = this;
    var email = $('#share-email').val();
    Meteor.call('sendShare', self._id, email, function (error) {
      if (error) {
        Messages.insert({ content: error.reason });
      } else {
        Messages.insert({ content: 'Invite has been sent.' });
        Router.go('/notes/' + self._id);
      }
    });
  },
  
  'click .user .delete': function (e) {
    e.preventDefault();
    
    UserNotes.remove({ userId: this._id });
  }
});

Template.share.helpers({
  // _id: function () {
  //   console.log(this)
  //   var note = Notes.find(this.note);
  //   return this._id;
  // }
  userNotes: function () {
    return UserNotes.find({ noteId: this._id });
  },
  
  users: function () {
    var userNotes = UserNotes.find({ noteId: this._id }).fetch();
    var users = []
    _.each(userNotes, function (userNote) {
      var user = Meteor.users.findOne(userNote.userId);
      user.deletable = userNote.isOwner;
      users.push(user);
    });
    return users;
  },
  
  isOwner: function (parent) {
    return UserNotes.findOne({ userId: Meteor.userId() }).isOwner;
  }
});

Template.share.rendered = function () {
  if (!Meteor.isCordova) {
    this.$('input').focus();
  }
}