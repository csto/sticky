Template.sidebar.events({
  'click #sign-out': function (e) {
    e.preventDefault();
    Meteor.logout(function () {
      Router.go('/');
      Messages.insert({ content: 'Signed out successfully.' });
    });
  }
});