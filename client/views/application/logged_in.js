Template.logged_in.events({
  'click': function (e) {
    if ($(e.target).parents('.dropdown-menu').length === 0 && !$(e.target).hasClass('.dropdown-menu')) {
      $('.dropdown-menu').removeClass('active'); 
    }
    
    if ($(e.target).parents('#actions').length === 0 && $(e.target).attr('id') !== '#actions') {
      $('#actions').removeClass('active');
    }
  },
  
  'click #sign-out': function (e) {
    e.preventDefault();
    Meteor.logout(function () {
      Router.go('/');
      Messages.insert({ content: 'Signed out successfully.' });
    });
  }
  
  // 'focus': function (e) {
  //   $target = $(e.currentTarget);
  //   if ($target.parents('.note').length > 0) {
  //     $target.parents('.note').scrollTop($target.position().top);
  //   }
  // }
});