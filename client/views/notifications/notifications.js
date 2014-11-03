Template.notification.events({
  'click .accept': function () {
    
  },
  
  'click .decline': function () {
    
  }
});

Template.notifications.helpers({
  notifications: function () {
    return Notes.find({ userId: Meteor.userId(), accepted: false });
  }
});

Template.layout.rendered = function (){
  if (Meteor.userId()) {
    var token = Session.get('token');
    if (token) {
      
    }
  }
};