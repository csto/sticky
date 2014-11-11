Template.logged_in.events({
  'click #wrapper': function (e) {
    e.preventDefault();
    if ($(e.currentTarget).hasClass('slide')) {
      $(e.currentTarget).toggleClass('slide');
      return false;
    }
  }
});