Template.sessions.events({
  'keyup input[type="email"]': function (e) {
    var email = $(e.currentTarget).val();
    Session.set('email', email);
  }
});