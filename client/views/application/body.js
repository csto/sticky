Template.body.rendered = function () {
  if (Meteor.isCordova) {
    $(document).on('backbutton', function () {
      if (window.history.state.initial){
        navigator.app.exitApp();
      } else {
        navigator.app.backHistory();
      }
    });
  }
}
