Template.header.events({
  'click #menu': function (e) {
    $('#sidebar-cover').show();
    $('#wrapper').toggleClass('slide');
    $('#menu').addClass('active');
    return false;
  },

  'keyup #search': function (e) {
    if (Meteor.isClient) {
      Session.set('search', $(e.target).val());
    }
  },
  
  'click #search-button': function (e) {
    $('#search-wrapper').addClass('search');
    $('#search-form input').focus();
  },
  
  'click #close-search': function (e) {
    Session.set('search', '');
    $('#search-wrapper').removeClass('search');
  }
});