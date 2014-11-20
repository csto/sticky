Meteor.startup(function () {
  Accounts.emailTemplates.resetPassword.text = function (uesr, url) {
    var url = url.replace('#/', '');
    return "Click this link to reset your password: " + url 
  }

  UserNotes._ensureIndex({ 'userId': 1 });
  UserNotes._ensureIndex({ 'noteId': 1 });
  UserNotes._ensureIndex({ 'userId': 1, 'noteId': 1 });
  Tasks._ensureIndex({ 'noteId': 1 });
  ShareTokens._ensureIndex({ 'noteId': 1 });
});