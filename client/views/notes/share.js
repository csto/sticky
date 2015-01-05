Template.share.events({
  'click #send-share': function (e) {
    var email = $('#share-email').val();

    Meteor.call('sendShare', currentNote(), email, function (error) {
      if (error) {
        Messages.insert({ content: error.reason });
      } else {
        Messages.insert({ content: 'Invite has been sent.' });
        Router.go('/notes/' + currentNote());
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