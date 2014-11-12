Template.sidebar.events({
  'click sidebar a': function (e) {
    $('#wrapper').removeClass('slide');
    $('#sidebar-cover').hide();
  },
  
  'click #sign-out': function (e) {
    e.preventDefault();
    Meteor.logout(function () {
      Router.go('/');
      Messages.insert({ content: 'Signed out successfully.' });
    });
  },
  
  'click #sidebar-cover': function (e) {
    $('#wrapper').removeClass('slide');
    $(e.target).hide();
  }
});