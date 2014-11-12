Template.logged_in.events({
  'click .dropdown-toggle': function (e) {
    $(e.currentTarget).next().toggleClass('active');
    return false;
  },

  'click': function (e) {
    if ($(e.target).parents('.dropdown-menu').length === 0 && !$(e.target).hasClass('.dropdown-menu')) {
      $('.dropdown-menu').removeClass('active');
    }
  }
});