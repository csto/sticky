Meteor.startup(function () {
  Accounts.emailTemplates.resetPassword.text = function (uesr, url) {
    var url = url.replace('#/', '');
    return "Click this link to reset your password: " + url 
  }

  // Meteor.users._ensureIndex({ "email": 1}); Add this
  // UserNotes._ensureIndex({ 'userId' 1 });
  // UserNotes._ensureIndex({ 'noteId' 1 });
  Tasks._ensureIndex({ 'noteId': 1 });
  ShareTokens._ensureIndex({ 'noteId': 1 });
  // Notifications._ensureIndex({ 'noteId': 1 });
});