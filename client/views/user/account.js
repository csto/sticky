Template.account.events({
  'submit #new-password-form': function (e) {
    e.preventDefault();

    var oldPassword = $('#old-password').val();
    var newPassword = $('#new-password').val();

    Accounts.changePassword(oldPassword, newPassword, function (error) {
      if (error) {
        Messages.insert({ content: error.reason });
      } else {
        Messages.insert({ content: 'Password successfully changed.' });
      }
    });
  }
});