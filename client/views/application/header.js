Template.header.events({
  'click #menu': function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('#sidebar-cover').show();
    $('#wrapper').toggleClass('slide');
  },

  'keyup #search': function (e) {
    if (Meteor.isClient) {
      Session.set('search', $(e.target).val())
    }
  },
  
  'click #search-button': function (e) {
    $('#search-wrapper').addClass('search');
    $('#search-form input').focus();
  },
  
  'click #close-search': function (e) {
    $('#search-wrapper').removeClass('search');
  }
});