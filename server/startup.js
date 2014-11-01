Meteor.startup(function () {
  Accounts.emailTemplates.resetPassword.text = function (uesr, url) {
    var url = url.replace('#/', '');
    return "Click this link to reset your password: " + url 
  }
});