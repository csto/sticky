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
  }
});

Template.share.helpers({
  // _id: function () {
  //   console.log(this)
  //   var note = Notes.find(this.note);
  //   return this._id;
  // }
});

Template.share.rendered = function () {
  this.$('input').focus();
}