Template.header.events({
  'click #menu': function (e) {
    $('#sidebar-cover').show();
    $('#wrapper').toggleClass('slide');
    return false;
  },

  'keyup #search': function (e) {
    if (Meteor.isClient) {
      Session.set('search', $(e.target).val());
    }
  },
  
  'focus #search': function (e) {
    $('#notes').addClass('animatable');
  },
  
  'blur #search': function (e) {
    $('#notes').removeClass('animatable');
  },
  
  'click #search-button': function (e) {
    $('#search-wrapper').addClass('search');
    $('#search-form input').focus();
  },
  
  'click #close-search': function (e) {
    $('#search-wrapper').removeClass('search');
  }
});