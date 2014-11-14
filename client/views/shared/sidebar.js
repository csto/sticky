// Template.sidebar.rendered = function () {
//   $('#sidebar-cover').draggable({
//     axis: 'x',
//     drag: function (event, ui) {
//       $('#wrapper').animate({ left: ui.offset.left, leaveTransforms: true });
//     }
//   });
// }

Template.sidebar.events({
  'click sidebar a': function (e) {
    $('#sidebar-cover').hide();
    $('#wrapper').removeClass('slide');
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