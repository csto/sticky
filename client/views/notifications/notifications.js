Template.notification.events({
  'click .accept': function (e) {
    e.preventDefault();

    Meteor.call('updateUserNote', this._id, { accepted: true });
  },
  
  'click .decline': function (e) {
    e.preventDefault();

    Meteor.remove(this._id);
  }
});

Template.notifications.helpers({
  notifications: function () {
    return UserNotes.find({ accepted: true });
  }
});

// Template.layout.rendered = function (){
//   if (Meteor.userId()) {
//     var token = Session.get('token');
//     if (token) {
      
//     }
//   }
// };