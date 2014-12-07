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
  
  'click #sidebar-cover': function (e) {
    $('#wrapper').removeClass('slide');
    $('#menu').removeClass('active');
    $(e.target).hide();
  }
});